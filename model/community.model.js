import { Schema, model } from "mongoose";

const communitySchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
        maxLength: 140,
        unique: true
    },
    communityPic: { type: String, required: true},
    createdAt: { type: Date, default: Date.now() },
});

const CommunityModel = model("Community", communitySchema);

export { CommunityModel };