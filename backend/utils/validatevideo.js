const ytdl = require("ytdl-core");

const validateVideo = async (youtubeUrl) => {
  try {
    await ytdl.getInfo(youtubeUrl);
    return true;
  } catch (error) {
    return false;
  }
};

const getVideoDuration = async (youtubeUrl) => {
  try {
    const info = await ytdl.getInfo(youtubeUrl);
    return info.videoDetails.lengthSeconds;
  } catch (error) {
    return false;
  }
};

module.exports = { validateVideo, getVideoDuration };
