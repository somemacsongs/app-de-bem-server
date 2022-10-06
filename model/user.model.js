import { Schema, model } from "mongoose";



const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  username: {type: String, required: true, unique: true},
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm,
  },
  username: { type: String, required: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["ADMIN", "USERFEM", "USERNB", "UNDEFINED"], default: "UNDEFINED" },
  createdAt: { type: Date, default: Date.now() },
  avatar: {type: String, default:"https://images2.imgbox.com/54/1f/hdwOJPTU_o.png"},
  moods: [{ type: Schema.Types.ObjectId, ref: "Mood" }],
  feeds: [{ type: Schema.Types.ObjectId, ref: "Feed" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }]
});

export const UserModel = model("User", userSchema);
