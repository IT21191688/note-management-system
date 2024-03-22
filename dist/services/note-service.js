"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const note_model_1 = __importDefault(require("../models/note-model"));
const save = async (note, session) => {
    if (session) {
        return await note.save({ session });
    }
    else {
        return await note.save();
    }
};
const findAllNotes = () => {
    return note_model_1.default.find({}).populate("createdBy");
};
const findAllByCreatedBy = (createdBy) => {
    return note_model_1.default.find({
        createdBy,
    });
};
const updateNoteStatus = async (noteId, status) => {
    return await note_model_1.default.findByIdAndUpdate(noteId, { $set: { "reminders.status": status } }, { new: true });
};
const findNoteById = (id) => {
    return note_model_1.default.findOne({ _id: id });
};
const updateNoteDetails = async (id, updatedDetails) => {
    return await note_model_1.default.findByIdAndUpdate(id, updatedDetails, { new: true });
};
const deleteNoteById = async (noteId) => {
    return await note_model_1.default.findByIdAndDelete(noteId);
};
exports.default = {
    save,
    findAllByCreatedBy,
    findNoteById,
    findAllNotes,
    updateNoteDetails,
    deleteNoteById,
    updateNoteStatus,
};
