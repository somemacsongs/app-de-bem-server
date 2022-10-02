import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    mood: { type: String, required: true, enum: ["DE BEM", "TRISTE", "DEPRIMIDO", "TENSO", "AGITADO", "EUFORICO", "APATICO"]},
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    bemzinha: { type: String, required: true},
    createdAt: { type: Date, default: Date.now() }
});