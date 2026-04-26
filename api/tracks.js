import db from "#db/client"
import express from "express";
const router = express.Router();
export default router;

router.get("/", async (req, res, next) => {
   try{
    const result = await db.query(`SELECT * FROM tracks`);
    res.send(result.rows);
   } catch(err){
    next(err);
   }
})
//Just some notes on what is actually going on here.
// result= await db.query is how you get the actual data
// next(err) passes the error to the error handler created in app.js


router.get("/:id", async (req, res, next ) => {
    try{
        const{id} = req.params;
        const result = await db.query(`SELECT * FROM tracks WHERE id = $1`,[id])
        res.send(result.rows[0]);
    } catch(err){
        next(err)
    }
})

//fun fact something i learned when you put the $1 and $2 and you have the bracket of those
// values next to psql request it will select the values in the same order they are wriiten 