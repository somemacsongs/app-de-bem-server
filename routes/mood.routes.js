import express from "express";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { FeedModel } from "../model/mood.model.js";

const moodRouter = express.Router();

moodRouter.post = ("/:idMood", async (req,res) => {
    try{



    } catch (err){
        console.log(err);
        return res.status(500).json(err);
    }
})

export { moodRouter } ;