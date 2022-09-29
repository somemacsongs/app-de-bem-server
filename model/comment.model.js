import { Schema, model } from "mongoose";

const avatars = ["https://images2.imgbox.com/ce/0c/YML20OD6_o.png","https://images2.imgbox.com/54/1f/hdwOJPTU_o.png","https://images2.imgbox.com/3d/d6/kfsaSCCt_o.png","https://images2.imgbox.com/65/0c/NKDImieB_o.png"]

const commentSchema = new Schema({
    body: { type: String, required: true, minLength: 1, trim: true, maxLength: 140 },
    owner: { type: String, required: true },
    replies: [{ type: Types.ObjectId, ref: "Reply" }],
    likes: [{ type: Types.ObjectId, ref: "User" , unique: true}],
    avatar: { type: String, default: avatars[Math.round(Math.random()*3)]}
});

const CommentModel = model("Comment", commentSchema);

export { CommentModel };