import { Schema, model } from "mongoose";

const avatars = ["https://images2.imgbox.com/54/1f/hdwOJPTU_o.png","https://images2.imgbox.com/3d/d6/kfsaSCCt_o.png","https://images2.imgbox.com/65/0c/NKDImieB_o.png"]

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm,
  },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
  createdAt: { type: Date, default: Date.now() },
  avatar: {type: String, default:"https://images2.imgbox.com/54/1f/hdwOJPTU_o.png"}
});

export const UserModel = model("User", userSchema);
