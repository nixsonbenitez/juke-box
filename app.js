import express from "express";
import playlistsRouter from "#api/playlists";
import tracksRouter from "#api/tracks";
const app = express();

app.use(express.json());

app.use("/playlists", playlistsRouter)
app.use("/tracks", tracksRouter)

app.use((err, req, res, next) => {
    console.error(err)
    res.status(err.status || 500).send(err.message || "something went wrong.")
})

//for our error log we are making this leaner by 
// presenting that incase of an error and it meets one of the conditions 
// use this!

export default app;