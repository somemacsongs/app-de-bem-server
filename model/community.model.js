import { Schema, model } from "mongoose";

const communitySchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: 3,
        trim: true,
        maxLength: 140
    },
    communityPic: { type: String, required: true},
    feeds: [{ type: Schema.Types.ObjectId, ref: "Feed"}],
    createdAt: { type: Date, default: Date.now() },
});

const CommunityModel = model("Community", communitySchema);

export { CommunityModel };