import express from "express";
import { generateToken } from "../config/jwt.config.js";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { UserModel } from "../model/user.model.js";

import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const { password } = req.body;

    if (
      !password ||
      !password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
      )
    ) {
      return res.status(400).json({
        msg: "Email ou senha invalidos. Verifique se ambos atendem as requisições.",
      });
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);

    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await UserModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });

    delete createdUser._doc.passwordHash;
    return res.status(201).json(createdUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ msg: "Email ou senha invalidos." });
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      const token = generateToken(user);

      return res.status(200).json({
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
          role: user.role,
          username: user.username,
          avatar:user.avatar
        },
        token: token,
      });
    } else {
      return res.status(401).json({ msg: "Email ou senha invalidos." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//READ USER 

userRouter.get("/:idUser", isAuth, attachCurrentUser, async (req, res) => {
    try{
      const {idUser} = req.params;
      const user = await UserModel.findOne({_id: idUser});

      if(!user) return res.status(404).json("User not found");

      delete user._doc.passwordHash;

      return res.status(200).json(user);

    } catch (err){
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

//UPDATE USER

userRouter.put("/:idUser/edit", isAuth, attachCurrentUser, async (req, res) => {
    try{

      const {idUser} = req.params;
      const currentUser = req.currentUser;

      const user = await UserModel.findOne({_id: idUser});

      if(!user) return res.status(404).json("User not found");

      if(currentUser._id.toString() !== idUser.toString()) return res.status(403).json("Only the user can edit their own profile");

      await UserModel.findOneAndUpdate({_id: idUser}, {...req.body});
      const updatedUser = await UserModel.findOne({_id: idUser});

      delete updatedUser._doc.passwordHash;

      return res.status(201).json(updatedUser);
      
    } catch(err){
      console.log(err);
      return res.status(500).json(err);
    }
})

export { userRouter };
