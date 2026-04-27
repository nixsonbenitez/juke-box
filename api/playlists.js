import db from "#db/client"
import express from "express";
const router = express.Router();
export default router;

//This will get the playlist
router.get("/", async (req, res, next) => {
    try{
        const result = await db.query( `
            SELECT * FROM playlists`);
            res.send(result.rows);
    } catch (err){
        next(err)
    }
})


//This will get the playlist by id
router.get("/:id", async (req, res, next) => {
    try{
        const{id}= req.params;
        if(isNaN(id)){
            return res.status(400).send("We have no records that match.");
        }
        const result = await db.query (`
            SELECT * FROM playlists WHERE id = $1
            `,[id]);
        if(!result.rows[0]){
            return res.status(404).send("Playlist not found!");
        }
        res.send(result.rows[0])
    } catch(err){
        next(err)
    }
})
//This will fetch the id and everything inside those track
router.get("/:id/tracks", async (req, res, next) => {
    try{
        const {id} = req.params;
        if(isNaN(id)){
            return res.status(400).send("id much be a number!")
        }
        const result = await db.query(`
            SELECT tracks.* FROM tracks
            JOIN playlists_tracks ON tracks.id = playlists_tracks.track_id
            WHERE playlists_tracks.playlist_id = $1
            `,[id])
        if(!result.rows[0]){
            return res.status(404).send("Track was not found")
        }
        res.send(result.rows)
    } catch (err) {
        next(err)
    }
})

//Select tracks.* is saying give me all the colymns from the tracks table
//From tracks is from the tracks
//JOIN playlists_tracks ON tracks.id = playlists_tracks.track_id
//Connect to the track table to the playlists_tracks table and matching the up 
//WHERE playlists_tracks.playlists_id = $1
// Only send me the table with the matching id

//THE POST SECTION 

//this handles sending the name of the playlist
router.post("/", async (req, res, next) => {
   try{
    if(!req.body){
        return res.status(400).send("Request body is missing")
    }
    const {name, description} = req.body;
    if(!name || !description){
        return res.status(400).send("Request body needs a name and a description")
    }
    
    const result = await db.query(
        `INSERT INTO playlists (name, description) VALUES ($1, $2) RETURNING *`, 
        [name, description]
    );
    res.status(201).send(result.rows[0]);
   }catch(err){
    next(err);
   }
});

//This handles the id and the tracks
router.post("/:id/tracks", async (req, res, next) => {
    try{
        const{id} = req.params;
        if(!req.body){
            return res.status(400).send("All fields are required to be filled")
        }
        const{trackId} = req.body;
        
        if(isNaN(id)){
            return res.status(400).send("Id must be a number")
        }
        if(!trackId){
            return res.status(400).send("trackId is required");
        }
        if(isNaN(trackId)){
            return res.status(400).send("TrackId must be a number")
        }

        const playlist = await db.query(
            `SELECT * FROM playlists WHERE id = $1`, [id]
        )

        if(!playlist.rows[0]){
            return res.status(404).send("playlist not found")
        }
        const track = await db.query(
            `SELECT * FROM tracks WHERE id = $1`, [trackId]
        )

        if(!track.rows[0]){
            return res.status(400).send("Track not found")
        }
         const result = await db.query(
            `INSERT INTO playlists_tracks(playlist_id, track_id) VALUES ($1, $2) RETURNING *`,
            [id, trackId],
        );
        res.status(201).send(result.rows[0])
    } catch (err) {
        if (err.code === "23505"){
            return res.status(400).send("Track is already in playlists")
        }
        next(err)
    }
})
//This post request check is a monster and a beast to write, what a tough one



//Its good to note that in queries, INSERTS are used to implement the post requests inside 
// of the datatable. Returning * is good to have to confirm if what we did worked.