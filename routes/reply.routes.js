import express from "express";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { ReplyModel } from "../model/comment.model.js";

const replyRouter = express.Router();

replyRouter.post = ("/:idFeed", async (req,res) => {
    try{
        /* Tô na dúvida se isso tá certo */
        const { username, avatar } = req.body;
    } catch (err){
        console.log(err);
        return res.status(500).json(err);
    }
})

export { replyRouter } ;