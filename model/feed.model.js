import { Schema, model } from "mongoose";

const feedSchema = new Schema({
    title: { type: String, required: true, minLength: 5, trim: true, maxLength: 50 },
    body: { type: String, required: true, minLength: 1, trim: true, maxLength: 280 },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" , unique: true}],
    avatar: { type: String, required: true}
});

const FeedModel = model("Feed", feedSchema);

export { FeedModel };