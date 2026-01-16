require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mindplay_games";

module.exports = {
  mongoURI: MONGODB_URI,
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.GAMES_PORT || 5001,
};
