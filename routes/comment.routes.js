import express from "express";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { CommentModel } from "../model/comment.model.js";
import { FeedModel } from "../model/feed.model.js";

const commentRouter = express.Router();

commentRouter.post = ("/:idFeed", isAuth, attachCurrentUser, async (req,res) => {
    try{
        const createdComment = await CommentModel.create({...req.body});
        
        const user = req.currentUser;
        createdComment._doc.owner = user._id;
        
        const {idFeed} = req.params.idFeed;
        const feed = await FeedModel.findOne({ _id: idFeed });
        feed.update({$push: {commenst: createdComment._doc._id}}).populate("Comment");

        

    } catch (err){
        console.log(err);
        return res.status(500).json(err);
    }
})

export { commentRouter } ;