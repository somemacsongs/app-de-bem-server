import { Schema, model } from "mongoose";

const replySchema = new Schema({
    body: { type: String, required: true, minLength: 1, trim: true, maxLength: 140 },
    owner: { type: String, required: true },
    // userLikesThis: [{ type: Schema.Types.ObjectId, ref: "User" }],
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now() }
});

const ReplyModel = model("Reply", replySchema);

export { ReplyModel };