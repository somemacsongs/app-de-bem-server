import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    body: { type: String, required: true, minLength: 1, trim: true, maxLength: 200 },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    feedFrom: { type: Schema.Types.ObjectId, ref: "Feed" },
    replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
    usersLikeThis: [{ type: Schema.Types.ObjectId, ref: "User" }],
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now() }
});

const CommentModel = model("Comment", commentSchema);

export { CommentModel };