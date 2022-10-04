import express from "express";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { CommentModel } from "../model/comment.model.js";
import { FeedModel } from "../model/feed.model.js";
import { UserModel } from "../model/user.model.js";

const commentRouter = express.Router();


//CREATE

commentRouter.post("/:idFeed", isAuth, attachCurrentUser, async (req,res) => {
    try{
        const user = req.currentUser;
        const {idFeed} = req.params;

        const feed = await FeedModel.findOne({_id:idFeed});
        const createdComment = await CommentModel.create({...req.body, owner: user._id, avatar: user.avatar, feedFrom:feed._id});
        
        await FeedModel.findOneAndUpdate({ _id: idFeed },{$push: {comments: createdComment._id}}).populate("comments");

        await UserModel.findOneAndUpdate({_id: user._id}, {$push:{comments: createdComment._id}}).populate("comments");

        return res.status(201).json(createdComment);
    } catch (err){
        console.log(err);
        return res.status(500).json(err);
    }
})

//READ ONE

commentRouter.get("/:idComment", isAuth, attachCurrentUser, async (req,res) => {
    try{

        const {idComment} = req.params;
        const comment = await CommentModel.findOne({_id: idComment}).populate("replies").populate("feedFrom");

        if(!comment){
            return res.status(404).json("Comment not found");
        }

        return res.status(201).json(comment);

    } catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
    
})

//READ ALL COMMENTS FROM A USER

commentRouter.get("/:idUser/userComments", isAuth, attachCurrentUser, async (req,res) => {
    try{

        const {idUser} = req.params;
        const user = await UserModel.findOne({_id: idUser}).populate("comments");

        if(!user){
            return res.status(404).json("User not found, no feeds to show");
        }

        return res.status(201).json(user.comments);

    } catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
    
})

//READ ALL FROM FEED

commentRouter.get("/:idFeed/feedComments", isAuth, attachCurrentUser, async (req,res) => {
    try{

        const {idFeed} = req.params;
        const feed = await FeedModel.findOne({_id: idFeed}).populate("comments");

        if(!feed){
            return res.status(404).json("Feed not found, no feeds to show");
        }

        return res.status(201).json(feed.comments);

    } catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
    
})

//DELETE

commentRouter.delete("/:idComment/delete", isAuth, attachCurrentUser, async (req,res) => {
    try{
        const user = req.currentUser;

        const {idComment} = req.params;
        const comment = await CommentModel.findOne({_id: idComment});
        
        if(!comment){
            return res.status(404).json("Comment not found");
        }

        if(user._id.toString() !== comment.owner.toString()){
            return res.status(500).json("This comment isn't yours to delete in the first place!")
        } 

        await CommentModel.findOneAndDelete({_id: idComment});
        await FeedModel.findOneAndUpdate({_id: comment.feedFrom}, {$pull:{comments: comment._id}});
        await UserModel.findOneAndUpdate({_id: user._id}, {$pull:{comments: comment._id}});

        return res.status(201).json("Comment deleted")

    } catch(err){
        console.log(err);
        return res.status(500).json(err)
    }
});

// UPDATE 

commentRouter.put("/:idComment/edit", isAuth, attachCurrentUser, async (req, res) => {
    try{
        const user = req.currentUser;
        const {idComment} = req.params;

        const comment = await CommentModel.findOne({_id: idComment});
        
        if(!comment){
            return res.status(404).json("Comment not found");
        }

        if(user._id.toString() !== comment.owner.toString()){
            return res.status(500).json("Only the owner of this comment can edit it")
        } 

        await CommentModel.findOneAndUpdate({_id: idComment},{...req.body});
        const updatedComment = await CommentModel.findOne({_id: idComment});
    
        return res.status(201).json(updatedComment);

    } catch(err){
        console.log(err);
        return res.status(201).json(err)
    }
})


export { commentRouter } ;