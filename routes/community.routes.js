import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isUserFem } from "../middlewares/;
import { isUserNB } from "../middlewares/;
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { CommunityModel } from "../model/community.model.js";

const communityRouter = express.Router ();

/* VENDO AS COMUNIDADES */

    /* GÊNERO FEMININO */
    communityRouter.get(
        "/communityFem",
        isAuth,
        attachCurrentUser,
        isAdmin,
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
        isAdmin,
        isUserNB,
        async (req, res) => {
        return res.status(200).json(req.currentUser);
        }
    );


/* CRIANDO AS COMUNIDADES */
    communityRouter.post("/community", isAuth, isAdmin, async (req, res) => {
        try {
            /* Não sei se isso aqui tá certo */
            const {title, communityPic} = req.body;
            return res.status(201).json({title, communityPic});
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });

export { communityRouter };