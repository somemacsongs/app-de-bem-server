import express from "express";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { CommentModel } from "../model/comment.model.js";

const commentRouter = express.Router();

commentRouter.post = ("/:idFeed", isAuth, attachCurrentUser, async (req,res) => {
    try{
    


    } catch (err){
        console.log(err);
        return res.status(500).json(err);
    }
})

export { commentRouter } ;