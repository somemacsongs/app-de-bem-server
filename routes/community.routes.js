import express from "express";
import isAuth  from "../middlewares/isAuth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import isUserFem from "../middlewares/isUserFem.js";
import isUserNB from "../middlewares/isUserNB.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { CommunityModel } from "../model/community.model.js";

const communityRouter = express.Router ();

/* VENDO AS COMUNIDADES */

    /* GÊNERO FEMININO */
    communityRouter.get(
        "/communityFem",
        isAuth,
        attachCurrentUser,
        isUserFem,
        async (req, res) => {
        return res.status(200).json(req.currentUser);
        }
    );

    /* NÃO-BINÁRIO */
    communityRouter.get(
        "/communityNB",
        isAuth,
        attachCurrentUser,
        isUserNB,
        async (req, res) => {
        return res.status(200).json(req.currentUser);
        }
    );


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

export { communityRouter };