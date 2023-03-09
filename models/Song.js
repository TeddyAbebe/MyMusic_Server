const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },

  artist: {
    type: String,
    require: true,
  },

  album: {
    type: String,
    require: true,
  },

  genre: {
    type: String,
    require: true,
  },
});

const Song = mongoose.model("Songs", SongSchema);
module.exports = Song;
