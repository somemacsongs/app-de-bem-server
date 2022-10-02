import { Schema, model } from "mongoose";

const replySchema = new Schema({
    body: { type: String, required: true, minLength: 1, trim: true, maxLength: 140 },
    owner: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" , unique: true}],
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now() }
});

const ReplyModel = model("Reply", replySchema);

export { ReplyModel };