import express from "express";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import {MoodModel} from "../model/mood.model.js"
import { UserModel } from "../model/user.model.js";

const moodRouter = express.Router();

moodRouter.post("/", isAuth, attachCurrentUser, async (req,res) => {
    try{
        const user = req.currentUser;  

        const createdMood = await MoodModel.create({...req.body, owner: user._id});
        await UserModel.findOneAndUpdate({_id: user._id}, {$push:{moods: createdMood._id}}).populate("moods");

        return res.status(201).json(createdMood);

    } catch (err){
        console.log(err);
        return res.status(500).json(err);
    }
})

export { moodRouter } ;