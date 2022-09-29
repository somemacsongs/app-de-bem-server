import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    body: { type: String, required: true, minLength: 1, trim: true, maxLength: 140 },
    owner: { type: String, required: true },
    replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" , unique: true}],
    avatar: { type: String, required: true}
});

const CommentModel = model("Comment", commentSchema);

export { CommentModel };