import mongoose from "mongoose";

const RecordSchema = new mongoose.Schema(
  {
    shedId: { type: String, required: true },
    treyCount: { type: Number, required: true }, // 1 trey == 300 eggs
    eggCount: { type: Number, required: true },  // trey * 300
    feedPerKg: { type: Number, required: true },
    henCount: { type: Number, default: 0 },  // daily chicken count
  },
  {
    timestamps: true,
  }
);

const record = mongoose.model("Record", RecordSchema);

export default record;
