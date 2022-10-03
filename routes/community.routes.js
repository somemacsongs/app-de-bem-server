import express from "express";
import isAuth  from "../middlewares/isAuth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import isUserFem from "../middlewares/isUserFem.js";
import isUserNB from "../middlewares/isUserNB.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { CommunityModel } from "../model/community.model.js";

const communityRouter = express.Router ();

/* VENDO TODAS AS COMUNIDADE PARA MULHERES */

communityRouter.get("/allFem", isAuth, attachCurrentUser, isUserFem, async (req, res) => {
    try{

        const communitiesFem = await CommunityModel.find({whoCanSee: "USERFEM"}).populate("feeds");


        return res.status(201).json(communitiesFem);

    } catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
});

/* VENDO TODAS AS COMUNIDADE PARA NAO-BINARIOS */

communityRouter.get("/allNB", isAuth, attachCurrentUser, isUserNB, async (req, res) => {
    try{

        const communitiesNB = await CommunityModel.find({whoCanSee: "USERNB"}).populate("feeds");


        return res.status(201).json(communitiesNB);

    } catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
});

/* VENDO UMA COMUNIDADE */

    communityRouter.get("/:idCommunity", isAuth, async (req, res) => {
        try{

            const {idCommunity} = req.params;
            const community = await CommunityModel.findOne({_id: idCommunity}).populate("feeds");

            if(!community){
                return res.status(404).json("Community not found");
            }

            return res.status(201).json(community);

        } catch(err){
            console.log(err);
            return res.status(500).json(err);
        }
    });


/* CRIANDO AS COMUNIDADES */
    communityRouter.post("/", isAuth, attachCurrentUser, isAdmin, async (req, res) => {
        try {

            const createdCommunity = await CommunityModel.create({...req.body});
            return res.status(201).json(createdCommunity);

        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });

/* DELETANDO AS COMUNIDADES */

    communityRouter.delete("/:idCommunity/delete", isAuth, attachCurrentUser, isAdmin, async (req,res) => {
        try{

            const {idCommunity} = req.params;
            await CommunityModel.findOneAndDelete({_id: idCommunity});

            return res.status(201).json("Comunidade deletada")

        } catch(err){
            console.log(err);
            return res.status(500).json(err)
        }
    });

/* EDITANDO AS COMUNIDADES */

    communityRouter.put("/:idCommunity/edit", isAuth, attachCurrentUser, isAdmin, async (req, res) => {
        try{

            const {idCommunity} = req.params;
            await CommunityModel.findOneAndUpdate({_id: idCommunity},{...req.body});
            const updatedCommunity = await CommunityModel.findOne({_id: idCommunity});
        
            return res.status(201).json(updatedCommunity);

        } catch(err){
            console.log(err);
            return res.status(201).json(err)
        }
    })

export { communityRouter };