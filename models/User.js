import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, min: 2, max: 50 },
    email: { type: String, required: true, max: 50, unique: true },
    password: { type: String, required: true, min: 6 },
  },
  { timestamps: true }
);

const user = mongoose.model("User", UserSchema);
export default user;
