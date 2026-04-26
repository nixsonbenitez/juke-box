import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  for(let i = 1; i <= 20; i++){
    await createTrack("Track " + i, 180000);
  }
  for(let i = 1; i <= 10; i++){
    await createPlaylist("Playlists " + i, "Description " + i);
  }
  for(let i = 1; i <= 15; i++){
    const trackId = 1 + Math.floor(Math.random() * 20);
    const playlistId = 1 + Math.floor(Math.random() * 10);
    await createPlaylistsTracks(playlistId, trackId)
  }
}


async function createTrack(name, duration_ms){
  await db.query(
    `INSERT INTO tracks(name, duration_ms) VALUES ($1, $2)`,
    [name, duration_ms]
  );
}

async function createPlaylist(name, description){
  await db.query(
    `INSERT INTO playlists(name, description) VALUES($1, $2)` , 
    [name, description]
  );
}

async function createPlaylistsTracks(playlistId, trackId){
  await db.query(
    `INSERT INTO playlists_tracks(playlist_id, track_id) VALUES ($1, $2)ON CONFLICT DO NOTHING`, /*This will make sure any combinations that lready exists just skips.*/
    [playlistId, trackId]
  )
}
// with these three functions I am matching the query with the tables from the schema as these will
// add in our track, playlist or both if both are request. db.query makes that call and the
// information inside the parenthesis confirms it.
