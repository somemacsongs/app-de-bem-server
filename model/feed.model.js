import { Schema, model } from "mongoose";

const feedSchema = new Schema({
    title: { type: String, required: true, minLength: 5, trim: true, maxLength: 140 },
    body: { type: String, required: true, minLength: 1, trim: true, maxLength: 280 },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    // userLikesThis: [{ type: Schema.Types.ObjectId, ref: "User" }],
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now() }
});

const FeedModel = model("Feed", feedSchema);

export { FeedModel };