import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Note title is required!"],
    },
    content: {
      type: String,
      required: [true, "Note content is required!"],
    },
    category: {
      type: String,
      default: "General",
    },
    document: {
      type: String,
      required: [false, "Note document is not required!"],
    },
    reminders: [
      {
        date: {
          type: Date,
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "completed"],
          default: "pending",
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Note", NoteSchema);
