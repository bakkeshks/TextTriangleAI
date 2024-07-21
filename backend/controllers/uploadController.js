const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const BlogPost = require("../models/blogPost");
const User = require("../models/User");
const Analytics = require("../models/Analytics");
const geminiAi = require("../services/geminiAI");
const { validateVideo, getVideoDuration } = require("../utils/validatevideo");
const { extractTranscript } = require("../services/extractTranscript");
const { saveUploadedFile } = require("../utils/saveUploadedFile");
const { getDuration } = require("../utils/getFileDuration");
const { transcribeAudio } = require("../services/assemblyAI");
require("dotenv").config();

exports.uploadAndProcessYoutube = async (req, res) => {
  const { youtubeUrl } = req.body;
  const userId = req.user.id;

  if (!youtubeUrl) {
    return res.status(400).json({ error: "YouTube URL is missing" });
  }

  try {
    // Validate YouTube URL
    const isValidVideo = await validateVideo(youtubeUrl);

    if (!isValidVideo) {
      return res.status(400).json({
        error: "Invalid YouTube URL or video duration exceeds 600 seconds",
      });
    }

    // Get the video duration
    const videoDuration = await getVideoDuration(youtubeUrl);

    if (!videoDuration) {
      return res.status(400).json({
        error: "Failed to get video duration",
      });
    }

    // Check secondsRemaining in the user table
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.secondsRemaining < videoDuration) {
      return res
        .status(400)
        .json({ error: "Video duration exceeds remaining seconds" });
    }

    // Extract transcript text
    const transcript = await extractTranscript(youtubeUrl);

    // Generate blog post
    const blogPostText = await geminiAi.generateBlogPost(transcript);

    // Save blog post to the database
    const newBlogPost = new BlogPost({
      blogPostId: uuidv4(),
      userId: userId,
      youtubeUrl: youtubeUrl,
      text: blogPostText,
    });
    await newBlogPost.save();

    // Update secondsRemaining
    user.secondsRemaining -= videoDuration;
    await user.save();

    // add blog post to analytics with duration
    const analytics = new Analytics({
      userId: userId,
      username: user.username,
      blogPostId: newBlogPost.blogPostId,
      duration: videoDuration,
    });
    await analytics.save();

    return res
      .status(200)
      .json({ message: "Blog post created and saved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to process YouTube video" });
  }
};

exports.uploadAndProcessVideo = async (req, res) => {
  const videoFile = req.file;
  const userId = req.user.id;

  if (!videoFile) {
    return res.status(400).json({ error: "Video file is missing" });
  }

  // save the file to local disk and get the path using saveUploadedFile function
  const uploadedFilePath = await saveUploadedFile(videoFile);
  const uploadedFilename = path.basename(uploadedFilePath);

  const videoDuration = await getDuration(uploadedFilePath);

  if (!videoDuration) {
    return res.status(400).json({
      error: "Failed to get video duration",
    });
  }

  // Check secondsRemaining in the user table
  const user = await User.findOne({ _id: userId });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.secondsRemaining < videoDuration) {
    return res
      .status(400)
      .json({ error: "Video duration exceeds remaining seconds" });
  }

  try {
    // Send video or audio to AssemblyAI for transcription
    const transcript = await transcribeAudio(uploadedFilePath);

    // Generate blog post with geminiAI

    const blogPostText = await geminiAi.generateBlogPost(transcript);

    // Save blog post to the database
    const newBlogPost = new BlogPost({
      blogPostId: uuidv4(),
      userId: userId,
      youtubeUrl: uploadedFilePath,
      text: blogPostText,
    });
    await newBlogPost.save();

    // add blog post to analytics with duration
    const analytics = new Analytics({
      userId: userId,
      username: user.username,
      blogPostId: newBlogPost.blogPostId,
      duration: videoDuration,
    });
    await analytics.save();

    // detect and update secondsRemaining in the user table

    user.secondsRemaining -= videoDuration;
    await user.save();

    // Delete files

    fs.unlink(uploadedFilePath, (err) => {
      if (err) {
        console.error(err);
      }
    });

    return res
      .status(200)
      .json({ message: "Blog post created and saved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to process video" });
  }
};
