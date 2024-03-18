"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const NoteSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = mongoose_1.default.model("Note", NoteSchema);
