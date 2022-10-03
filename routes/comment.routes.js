import express from "express";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { CommentModel } from "../model/comment.model.js";
import { FeedModel } from "../model/feed.model.js";

const commentRouter = express.Router();

commentRouter.post("/:idFeed", isAuth, attachCurrentUser, async (req,res) => {
    try{
        const user = req.currentUser;
        const createdComment = await CommentModel.create({...req.body, owner: user._id, avatar: user.avatar});
        
        const idFeed = req.params.idFeed;
        await FeedModel.findOneAndUpdate({ _id: idFeed },{$push: {comments: createdComment._id}}).populate("Feed");

        return res.status(201).json(createdComment);
    } catch (err){
        console.log(err);
        return res.status(500).json(err);
    }
})

export { commentRouter } ;