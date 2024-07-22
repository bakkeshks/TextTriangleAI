// mongodb connection EX: "mongodb://localhost:27017/videotoblog" where videotoblog is the database name

module.exports = {
  uri: process.env.MONGODB_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
