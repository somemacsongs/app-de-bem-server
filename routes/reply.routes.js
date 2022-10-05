import express from "express";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { ReplyModel } from "../model/reply.model.js";
import { CommentModel } from "../model/comment.model.js";
import { UserModel } from "../model/user.model.js";

const replyRouter = express.Router();

//CREATE

replyRouter.post("/:idComment", isAuth, attachCurrentUser, async (req,res) => {
    try{
    const user = req.currentUser;
    const {idComment} = req.params;

    const comment = await CommentModel.findOne({ _id: idComment });
    const createdReply = await ReplyModel.create({...req.body, avatar: user.avatar, owner: user._id, commentFrom: comment._id});

    await CommentModel.findOneAndUpdate({ _id: comment._id },{$push: {replies: createdReply._id}});

    await UserModel.findOneAndUpdate({_id: user._id}, {$push:{replies: createdReply._id}});

    return res.status(201).json(createdReply);


    } catch (err){
        console.log(err);
        return res.status(500).json(err);
    }
})

//READ ONE

replyRouter.get("/:idReply", isAuth, attachCurrentUser, async (req,res) => {
    try{

        const {idReply} = req.params;
        const reply = await ReplyModel.findOne({_id: idReply}).populate("commentFrom");

        if(!reply){
            return res.status(404).json("Reply not found");
        }

        return res.status(201).json(reply);

    } catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
    
})

//READ ALL REPLIES FROM A USER

replyRouter.get("/:idUser/userReplies", isAuth, attachCurrentUser, async (req,res) => {
    try{

        const {idUser} = req.params;
        const user = await UserModel.findOne({_id: idUser}).populate("replies");

        if(!user){
            return res.status(404).json("User not found, no replies to show");
        }

        return res.status(201).json(user.replies);

    } catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
    
})

//READ ALL FROM COMMUNITY

replyRouter.get("/:idComment/commentReplies", isAuth, attachCurrentUser, async (req,res) => {
    try{

        const {idComment} = req.params;
        const comment = await CommentModel.findOne({_id: idComment}).populate("replies");

        if(!comment){
            return res.status(404).json("Comment not found, no replies to show");
        }

        return res.status(201).json(comment.replies);

    } catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
    
})

//DELETE

replyRouter.delete("/:idReply/delete", isAuth, attachCurrentUser, async (req,res) => {
    try{
        const user = req.currentUser;
       
        const {idReply} = req.params;
        const reply = await ReplyModel.findOne({_id: idReply});
        
        if(!reply){
            return res.status(404).json("Reply not found");
        }

        if(user._id.toString() !== reply.owner.toString()){
            return res.status(423).json("This reply isn't yours to delete in the first place!")
        } 

        await ReplyModel.findOneAndDelete({_id: reply._id});
        await CommentModel.findOneAndUpdate({_id: reply.commentFrom}, {$pull:{replies: reply._id}});
        await UserModel.findOneAndUpdate({_id: user._id}, {$pull:{replies: reply._id}});

        return res.status(201).json("Reply deleted")

    } catch(err){
        console.log(err);
        return res.status(500).json(err)
    }
});

//UPDATE

replyRouter.put("/:idReply/edit", isAuth, attachCurrentUser, async (req, res) => {
    try{
        const user = req.currentUser;
        const {idReply} = req.params;

        const reply = await ReplyModel.findOne({_id: idReply});
        
        if(!reply){
            return res.status(404).json("Reply not found");
        }

        if(user._id.toString() !== reply.owner.toString()){
            return res.status(423).json("Only the owner of this reply can edit it")
        } 

        await ReplyModel.findOneAndUpdate({_id: idReply},{...req.body});
        const updatedReply = await ReplyModel.findOne({_id: idReply});
    
        return res.status(201).json(updatedReply);

    } catch(err){
        console.log(err);
        return res.status(201).json(err)
    }
})

//LIKE

replyRouter.put("/:idReply/like", isAuth, attachCurrentUser, async (req,res) => {
    try{

        const user = req.currentUser;
        const {idReply} = req.params;

        const reply = await ReplyModel.findOne({_id: idReply});
        
        if(!reply){
            return res.status(404).json("Reply not found");
        }

        if(reply.usersLikeThis.includes(user._id.toString())){

            await ReplyModel.findOneAndUpdate({_id: idReply}, {$pull: {usersLikeThis: user._id}});
            const updatedReply = await ReplyModel.findOne({_id: idReply});

            return res.status(201).json({msg: `${updatedReply.usersLikeThis.length} users like this.`, count: updatedReply.usersLikeThis.length})

        } 

        await ReplyModel.findOneAndUpdate({_id: idReply}, {$push: {usersLikeThis: user._id}});
        const updatedReply = await ReplyModel.findOne({_id: idReply});

        return res.status(201).json({msg: `${updatedReply.usersLikeThis.length} users like this.`, count: updatedReply.usersLikeThis.length})

    }catch(err){
        console.log(err);
        return res.status(500).json(err)
    }
})




export { replyRouter } ;