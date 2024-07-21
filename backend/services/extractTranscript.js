const { YoutubeTranscript } = require("youtube-transcript");

const extractVideoId = (url) => {
  const videoIdRegex =
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/.*[?&]v=([^?&]+)|(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?&]+)|(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?&]+)/;
  const match = url.match(videoIdRegex);
  return match && (match[1] || match[2] || match[3]);
};

const extractTranscript = async (youtubeUrl) => {
  try {
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return transcript.map((caption) => caption.text).join(" ");
  } catch (error) {
    console.error("Error extracting transcript", error);
    throw error;
  }
};

module.exports = { extractTranscript };
