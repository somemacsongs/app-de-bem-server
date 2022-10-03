import express from "express";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { ReplyModel } from "../model/reply.model.js";
import { CommentModel } from "../model/comment.model.js";

const replyRouter = express.Router();

replyRouter.post("/:idComment", isAuth, attachCurrentUser, async (req,res) => {
    try{
        const user = req.currentUser;
        const createdReply = await ReplyModel.create({...req.body, owner: user._id, avatar: user.avatar});
        
        const idComment = req.params.idComment;
        await CommentModel.findOneAndUpdate({ _id: idComment },{$push: {replies: createdReply._id}}).populate("Comment");

        return res.status(201).json(createdReply)
    } catch (err){
        console.log(err);
        return res.status(500).json(err);
    }
})

export { replyRouter } ;