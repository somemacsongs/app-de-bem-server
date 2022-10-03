import express from "express";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { ReplyModel } from "../model/comment.model.js";
import { CommentModel } from "../model/comment.model.js";

const replyRouter = express.Router();

replyRouter.post = ("/:idComment", isAuth, attachCurrentUser, async (req,res) => {
    try{
        const user = req.currentUser;
        const createdReply = await ReplyModel.create({...req.body, owner: user._id});
        
        const {idComment} = req.params.idComment;
        const comment = await CommentModel.findOne({ _id: idComment });
        comment.update({$push: {replies: createdReply._doc._id}}).populate("Reply");


    } catch (err){
        console.log(err);
        return res.status(500).json(err);
    }
})

export { replyRouter } ;