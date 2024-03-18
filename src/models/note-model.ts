import mongoose, { Document } from "mongoose";

interface Note extends Document {
  title: string;
  content: string;
  category: string;
  document?: string;
  reminders: {
    date?: Date;
    status?: string;
  };
  createdBy: mongoose.Schema.Types.ObjectId;
}

const NoteSchema = new mongoose.Schema<Note>(
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
      default: "general",
    },
    document: {
      type: String,
      required: [false, "Note document is not required!"],
    },
    reminders: {
      date: {
        type: Date,
        required: function () {
          return this.category === "reminder";
        },
      },
      status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
        required: function () {
          return this.category === "reminder";
        },
      },
    },
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

export default mongoose.model<Note>("Note", NoteSchema);
