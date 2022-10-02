import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    body: { type: String, required: true, minLength: 1, trim: true, maxLength: 200 },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" , unique: true}],
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now() }
});

const CommentModel = model("Comment", commentSchema);

export { CommentModel };