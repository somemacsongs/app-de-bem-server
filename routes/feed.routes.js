import express from "express";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { FeedModel } from "../model/feed.model.js";

const feedRouter = express.Router();

feedRouter.post = ("/:idFeed", async (req,res) => {
    try{



    } catch (err){
        console.log(err);
        return res.status(500).json(err);
    }
})

export { feedRouter } ;