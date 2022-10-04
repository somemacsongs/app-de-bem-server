import express from "express";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { ReplyModel } from "../model/reply.model.js";
import { CommentModel } from "../model/comment.model.js";
import { UserModel } from "../model/user.model.js";

const replyRouter = express.Router();

replyRouter.post("/:idComment", isAuth, attachCurrentUser, async (req,res) => {
    try{
        const user = req.currentUser;
        const {idComment} = req.params;

        const comment = await CommentModel.findOne({_id: idComment});
        const createdReply = await ReplyModel.create({...req.body, owner: user._id, avatar: user.avatar, commentFrom: idComment});
        
        await CommentModel.findOneAndUpdate({ _id: idComment },{$push: {replies: createdReply._id}});

        await UserModel.findOneAndUpdate({_id: user._id}, {$push:{replies: createdReply._id}});

        return res.status(201).json(createdReply)
    } catch (err){
        console.log(err);
        return res.status(500).json(err);
    }
})

export { replyRouter } ;