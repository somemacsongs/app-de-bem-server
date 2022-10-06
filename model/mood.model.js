import { Schema, model } from "mongoose";

const moodSchema = new Schema({
    mood: { type: String, required: true, enum: ["de bem", "triste", "apatico", "com raiva", "ansioso"]},
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    bemzinha: { type: String, default:"https://images2.imgbox.com/54/1f/hdwOJPTU_o.png"},
    createdAt: { type: Date, default: Date.now() },
    text: { type: String },
    color: { type: String }
});

const MoodModel = model("Mood", moodSchema);

export { MoodModel };