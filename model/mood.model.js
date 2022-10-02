import { Schema, model } from "mongoose";

const moodSchema = new Schema({
    mood: { type: String, required: true, enum: ["DE BEM", "TRISTE", "DEPRIMIDO", "TENSO", "AGITADO", "EUFORICO", "APATICO"]},
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    bemzinha: { type: String, default:"https://images2.imgbox.com/54/1f/hdwOJPTU_o.png"},
    createdAt: { type: Date, default: Date.now() }
});

const MoodModel = model("Mood", moodSchema);

export { MoodModel };