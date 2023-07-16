import { Schema, Types, model } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "toDo",
      enum: ["toDo", "Doing", "Done"],
    },
    user_id: {
      // manager who created that task
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    assignTo: {
      // employee who is required to finish that task
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    deadline: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const taskModel = model("Task", taskSchema);

export default taskModel;
