import { Schema, model } from "mongoose";

const replySchema = new Schema({
    body: { type: String, required: true, minLength: 1, trim: true, maxLength: 140 },
    owner: { type: String, required: true },
    commentFrom: { type: Schema.Types.ObjectId, ref: "Comment" },
    avatar: { type: String },
    usersLikeThis: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now() }
});

const ReplyModel = model("Reply", replySchema);

export { ReplyModel };