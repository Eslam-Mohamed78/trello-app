import { Schema, Types, model } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      default: "Male",
      enum: ["Male", "Female"],
    },
    age: Number,
    phone: {
      type: String,
      unique: true,
    },
    isOnline: {
      type: String,
      default: "false",
    },
    isDeleted: {
      type: String,
      default: "false",
    },
  },
  { timestamps: true }
);

const userModel = model("User", userSchema);

export default userModel;
