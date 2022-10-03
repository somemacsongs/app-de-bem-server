import express from "express";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { FeedModel } from "../model/feed.model.js";
import { CommunityModel } from "../model/community.model.js";

const feedRouter = express.Router();

feedRouter.post("/:idCommunity", isAuth, attachCurrentUser, async (req,res) => {
    try{
    const user = req.currentUser;  
    const createdFeed = await FeedModel.create({...req.body, avatar: user.avatar, owner: user._id});


    const idCommunity = req.params.idCommunity;
    console.log(idCommunity)
    console.log(createdFeed)
    await CommunityModel.findOneAndUpdate({ _id: idCommunity },{$push: {feeds: createdFeed._id}}).populate("Community");
 

    return res.status(201).json(createdFeed);


    } catch (err){
        console.log(err);
        return res.status(500).json(err);
    }
})

export { feedRouter } ;