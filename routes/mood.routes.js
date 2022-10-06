import express from "express";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import {MoodModel} from "../model/mood.model.js"
import { UserModel } from "../model/user.model.js";

const moodRouter = express.Router();

//CREATE

moodRouter.post("/", isAuth, attachCurrentUser, async (req,res) => {
    try{
        const user = await UserModel.findOne({_id: req.currentUser._id}).populate("moods");

        if(user.moods.length!==0){

            if(user.moods[user.moods.length-1].createdAt.toString().slice(0,15) === new Date(Date.now()).toString().slice(0,15)){
                
                return res.status(401).json({msg: "You cannot set two moods in one day"});
            } 

        }

        const createdMood = await MoodModel.create({...req.body, owner: user._id});
        await UserModel.findOneAndUpdate({_id: user._id}, {$push:{moods: createdMood._id}});

        return res.status(201).json(createdMood);

    } catch (err){
        console.log(err);
        return res.status(500).json(err);
    }
})

//READ MOOD

moodRouter.get("/:idMood", isAuth, attachCurrentUser, async (req,res) => {
    try{

        const user = req.currentUser;
        const {idMood} = req.params;

        const mood = await MoodModel.findOne({_id: idMood});

        if(!mood){
            return res.status(404).json("Mood doesn't exist");
        }

        if(user._id.toString() !== mood.owner.toString()){
            return res.status(423).json("Only the mood's owner can see this.")
        }

        return res.status(201).json(mood);

    } catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
})

//READ MOODS FROM USER

moodRouter.get("/:idUser/allMoods", isAuth, attachCurrentUser, async (req,res) => {
    try{

        const {idUser} = req.params;
        const user = UserModel.findOne({_id: idUser});

        if(!user){
            return res.status(404).json("User not found.");
        }

        const moods = await MoodModel.find({owner: idUser});

        if(!moods){
            return res.status(404).json("User hasn't added moods yet.");
        }

        return res.status(201).json(moods);

    } catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
})

//UPDATE

moodRouter.put("/:idMood/edit", isAuth, attachCurrentUser, async (req,res) => {
    try{

        const {idMood} = req.params;
        const user = req.currentUser;

        const mood = await MoodModel.findOne({_id: idMood});

        if(!mood){
            return res.status(404).json("Mood doesn't exist");
        }

        if(user._id.toString() !== mood.owner.toString()){
            return res.status(423).json("Only the mood's owner can edit it.")
        }

        await MoodModel.findOneAndUpdate({_id: idMood}, {...req.body});
        const updatedMood = await MoodModel.findOne({_id: idMood});

        return res.status(201).json(updatedMood);

    } catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
})

//DELETE

moodRouter.delete("/:idMood/delete", isAuth, attachCurrentUser, async (req, res) => {
    try{

        const {idMood} = req.params;
        const user = req.currentUser;

        const mood = await MoodModel.findOne({_id: idMood});

        if(!mood){
            return res.status(404).json("Mood doesn't exist");
        }

        if(user._id.toString() !== mood.owner.toString()){
            return res.status(423).json("Only the mood's owner can delete it.")
        }

        await MoodModel.findOneAndDelete({_id: idMood});
        await UserModel.findOneAndUpdate({_id: user._id}, {$pull: {moods: mood._id}});

        return res.status(201).json("Mood deleted");

    } catch (err){
        console.log(err);
        return res.status(500).json(err);
    }
})

export { moodRouter } ;