import express from "express";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { FeedModel } from "../model/feed.model.js";
import { CommunityModel } from "../model/community.model.js";
import { UserModel } from "../model/user.model.js";

const feedRouter = express.Router();

//CREATE

feedRouter.post("/:idCommunity", isAuth, attachCurrentUser, async (req,res) => {
    try{
    const user = req.currentUser;
    const {idCommunity} = req.params;

    const community = await CommunityModel.findOne({ _id: idCommunity });
    const createdFeed = await FeedModel.create({...req.body, avatar: user.avatar, owner: user._id, communityFrom: community._id});

    await CommunityModel.findOneAndUpdate({ _id: idCommunity },{$push: {feeds: createdFeed._id}});

    await UserModel.findOneAndUpdate({_id: user._id}, {$push:{feeds: createdFeed._id}});

    return res.status(201).json(createdFeed);


    } catch (err){
        console.log(err);
        return res.status(500).json(err);
    }
})

//READ ONE

feedRouter.get("/:idFeed", isAuth, attachCurrentUser, async (req,res) => {
    try{

        const {idFeed} = req.params;
        const feed = await FeedModel.findOne({_id: idFeed}).populate("comments").populate("communityFrom");

        if(!feed){
            return res.status(404).json("Feed not found");
        }

        return res.status(201).json(feed);

    } catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
    
})

//READ ALL FEEDS FROM A USER

feedRouter.get("/:idUser/userFeeds", isAuth, attachCurrentUser, async (req,res) => {
    try{

        const {idUser} = req.params;
        const user = await UserModel.findOne({_id: idUser}).populate("feeds");

        if(!user){
            return res.status(404).json("User not found, no feeds to show");
        }

        return res.status(201).json(user.feeds);

    } catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
    
})

//READ ALL FROM COMMUNITY

feedRouter.get("/:idCommunity/communityFeeds", isAuth, attachCurrentUser, async (req,res) => {
    try{

        const {idCommunity} = req.params;
        const feeds = await FeedModel.find({communityFrom: idCommunity}).populate("owner");

        if(!feeds){
            return res.status(404).json("No feeds to show");
        }

        return res.status(201).json(feeds);

    } catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
    
})

//DELETE

feedRouter.delete("/:idFeed/delete", isAuth, attachCurrentUser, async (req,res) => {
    try{
        const user = req.currentUser;
       
        const {idFeed} = req.params;
        const feed = await FeedModel.findOne({_id: idFeed});
        
        if(!feed){
            return res.status(404).json("Feed not found");
        }

        if(user._id.toString() !== feed.owner.toString()){
            return res.status(423).json("This feed isn't yours to delete in the first place!")
        } 

        await FeedModel.findOneAndDelete({_id: idFeed});
        await CommunityModel.findOneAndUpdate({_id: feed.communityFrom}, {$pull:{feeds: feed._id}});
        await UserModel.findOneAndUpdate({_id: user._id}, {$pull:{feeds: feed._id}});

        return res.status(201).json("Feed deleted")

    } catch(err){
        console.log(err);
        return res.status(500).json(err)
    }
});

//UPDATE

feedRouter.put("/:idFeed/edit", isAuth, attachCurrentUser, async (req, res) => {
    try{
        const user = req.currentUser;
        const {idFeed} = req.params;

        const feed = await FeedModel.findOne({_id: idFeed});
        
        if(!feed){
            return res.status(404).json("Feed not found");
        }

        if(user._id.toString() !== feed.owner.toString()){
            return res.status(423).json("Only the owner of this feed can edit it")
        } 

        await FeedModel.findOneAndUpdate({_id: idFeed},{...req.body});
        const updatedFeed = await FeedModel.findOne({_id: idFeed});
    
        return res.status(201).json(updatedFeed);

    } catch(err){
        console.log(err);
        return res.status(201).json(err)
    }
})

//LIKE

feedRouter.put("/:idFeed/like", isAuth, attachCurrentUser, async (req,res) => {
    try{

        const user = req.currentUser;
        const {idFeed} = req.params;

        const feed = await FeedModel.findOne({_id: idFeed}).populate("usersLikeThis");
        
        if(!feed){
            return res.status(404).json("Feed not found");
        }

        if(feed.usersLikeThis.includes(user._id.toString())){

            await FeedModel.findOneAndUpdate({_id: idFeed}, {$pull: {usersLikeThis: user._id}});
            const updatedFeed = await FeedModel.findOne({_id: idFeed});

            return res.status(201).json({msg: `${updatedFeed.usersLikeThis.length} users like this.`, count: updatedFeed.usersLikeThis.length})

        } 

        await FeedModel.findOneAndUpdate({_id: idFeed}, {$push: {usersLikeThis: user._id}});
        const updatedFeed = await FeedModel.findOne({_id: idFeed});

        return res.status(201).json({msg: `${updatedFeed.usersLikeThis.length} users like this.`, count: updatedFeed.usersLikeThis.length})

    }catch(err){
        console.log(err);
        return res.status(500).json(err)
    }
})

//UNLIKE

feedRouter.put("/:idFeed/unlike", isAuth, attachCurrentUser, async (req,res) => {
    try{

        const user = req.currentUser;
        const {idFeed} = req.params;

        const feed = await FeedModel.findOne({_id: idFeed});
        
        if(!feed){
            return res.status(404).json("Feed not found");
        }

        await FeedModel.findOneAndUpdate({_id: idFeed}, {$pull: {usersLikeThis: user._id}});
        const updatedFeed = await FeedModel.findOne({_id: idFeed});

        return res.status(201).json({msg: `${updatedFeed.usersLikeThis.length} users like this.`, count: updatedFeed.usersLikeThis.length})

    }catch(err){
        console.log(err);
        return res.status(500).json(err)
    }
})

export { feedRouter } ;