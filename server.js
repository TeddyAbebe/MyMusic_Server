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

app.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const newTitle = req.body.newTitle;
  const newArtist = req.body.newArtist;
  const newAlbum = req.body.newAlbum;
  const newGenre = req.body.newGenre;

  console.log("Updating song with ID:", id);
  console.log("New title:", newTitle);
  console.log("New artist:", newArtist);
  console.log("New album:", newAlbum);
  console.log("New genre:", newGenre);

  try {
    const updatedSong = await SongList.findById(id);
    console.log("Current song data:", updatedSong);

    updatedSong.title = newTitle;
    updatedSong.artist = newArtist;
    updatedSong.album = newAlbum;
    updatedSong.genre = newGenre;

    console.log("Updated song data:", updatedSong);

    await updatedSong.save();
    res.send("updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  await SongList.findByIdAndRemove(id).exec();
  res.send("deleted");
});

app.listen(3001, () => {
  console.log("Server is running on port 3001...");
});
