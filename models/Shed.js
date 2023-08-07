import mongoose from "mongoose";

const ShedSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  shedName: { type: String, default: "Shed" },
  initialHenCount: { type: Number, default: 0 },
  initialFeedPerKg: { type: Number, default: 0 },
});

const shed = mongoose.model("Shed", ShedSchema);

export default shed;
