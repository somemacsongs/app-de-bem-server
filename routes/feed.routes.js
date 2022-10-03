import express from "express";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { FeedModel } from "../model/feed.model.js";
import { CommunityModel } from "../model/community.model.js";
import { UserModel } from "../model/user.model.js";

const feedRouter = express.Router();

feedRouter.post("/:idCommunity", isAuth, attachCurrentUser, async (req,res) => {
    try{
    const user = req.currentUser;  
    const createdFeed = await FeedModel.create({...req.body, avatar: user.avatar, owner: user._id});


    const idCommunity = req.params.idCommunity;
    console.log(idCommunity)
    console.log(createdFeed)
    await CommunityModel.findOneAndUpdate({ _id: idCommunity },{$push: {feeds: createdFeed._id}});

    await UserModel.findOneAndUpdate({_id: user._id}, {$push:{feeds: createdFeed._id}});

    return res.status(201).json(createdFeed);


    } catch (err){
        console.log(err);
        return res.status(500).json(err);
    }
})

export { feedRouter } ;