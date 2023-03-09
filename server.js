const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const SongList = require("./models/Song");

// Create express app
const app = express();

// Set up middleware
app.use(express.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://TeddyAbebe:2149ted@crud.kvj3soz.mongodb.net/Songs?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

app.post("/insert", async (req, res) => {
  const title = req.body.title;
  const artist = req.body.artist;
  const album = req.body.album;
  const genre = req.body.genre;

  const song = new SongList({
    title: title,
    artist: artist,
    album: album,
    genre: genre,
  });
  try {
    await song.save();
    res.send("Data Inserted");
  } catch (err) {
    console.log(err);
  }
});

app.get("/read", async (req, res) => {
  try {
    const result = await SongList.find({});
    res.send(result);
  } catch (err) {
    res.send(err);
  }
});

app.put("/update", async (req, res) => {
  const id = req.body.id;
  const newTitle = req.body.newTitle;
  const newArtist = req.body.newArtist;
  const newAlbum = req.body.newAlbum;
  const newGenre = req.body.newGenre;

  try {
    try {
      const updatedSong = await SongList.findById(id);
      updatedSong.title = newTitle;
      updatedSong.artist = newArtist;
      updatedSong.album = newAlbum;
      updatedSong.genre = newGenre;
      await updatedSong.save();
      res.send("updated");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  } catch (err) {
    console.log(err);
  }
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  await SongList.findByIdAndRemove(id).exec();
  res.send("deleted");
});

app.get("/statistics", async (req, res) => {
  const stats = await SongList.aggregate([
    // Total # of songs, artists, albums, genres
    {
      $group: {
        _id: null,
        totalSongs: { $sum: 1 },
        totalArtists: { $addToSet: "$artist" },
        totalAlbums: { $addToSet: "$album" },
        totalGenres: { $addToSet: "$genre" },
      },
    },
    {
      $project: {
        _id: 0,
        totalSongs: 1,
        totalArtists: { $size: "$totalArtists" },
        totalAlbums: { $size: "$totalAlbums" },
        totalGenres: { $size: "$totalGenres" },
      },
    },
  ]);

  const genreStats = await SongList.aggregate([
    // # of songs in every genre
    {
      $group: {
        _id: "$genre",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        genre: "$_id",
        count: 1,
      },
    },
  ]);

  const artistStats = await SongList.aggregate([
    // # of songs & albums each artist has
    {
      $group: {
        _id: "$artist",
        songs: { $addToSet: "$title" },
        albums: { $addToSet: "$album" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        artist: "$_id",
        songs: { $size: "$songs" },
        albums: { $size: "$albums" },
        count: 1,
      },
    },
  ]);

  const albumStats = await SongList.aggregate([
    // # of songs in each album
    {
      $group: {
        _id: "$album",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        album: "$_id",
        count: 1,
      },
    },
  ]);

  res.json({ stats, genreStats, artistStats, albumStats });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001...");
});
