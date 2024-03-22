"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindOneNoteById = exports.DeleteNote = exports.EditNoteDetails = exports.FindAllNotes = exports.CreateNote = void 0;
const http_status_codes_1 = require("http-status-codes");
const note_service_1 = __importDefault(require("../services/note-service"));
const responce_1 = __importDefault(require("../utills/responce"));
const storage_config_1 = __importDefault(require("../config/storage-config"));
const NotFoundError_1 = __importDefault(require("../utills/error/error.classes/NotFoundError"));
const ForbiddenError_1 = __importDefault(require("../utills/error/error.classes/ForbiddenError"));
const note_model_1 = __importDefault(require("../models/note-model"));
const constants_1 = __importDefault(require("../utills/constants"));
const CreateNote = async (req, res) => {
    const body = req.body;
    const auth = req.auth;
    let file = req.file;
    //console.log(req.body);
    let createdNote = null;
    try {
        let documentUri = ""; // Initialize document URI variable
        // Upload the file if provided
        let uploadedDocument = null;
        if (file) {
            uploadedDocument = await storage_config_1.default.uploadImageAndGetUri(file, constants_1.default.CLOUDINARY.FILE_NAME + "/notes");
            if (documentUri != null) {
                documentUri = uploadedDocument.uri.toString();
            }
        }
        const newNote = new note_model_1.default({
            title: body.title,
            content: body.content,
            category: body.category || "General",
            document: documentUri,
            reminders: body.reminders || "",
            createdBy: auth._id,
        });
        //console.log(body.reminders);
        createdNote = await note_service_1.default.save(newNote, null);
        (0, responce_1.default)(res, true, http_status_codes_1.StatusCodes.CREATED, "Note created successfully!", createdNote);
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error creating Note",
            error: error.message,
        });
    }
};
exports.CreateNote = CreateNote;
const FindAllNotes = async (req, res) => {
    const auth = req.auth;
    try {
        const userNotes = await note_service_1.default.findAllByCreatedBy(auth._id);
        (0, responce_1.default)(res, true, http_status_codes_1.StatusCodes.OK, "Your notes retrieved successfully!", userNotes);
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error retrieving notes",
            error: error.message,
        });
    }
};
exports.FindAllNotes = FindAllNotes;
const EditNoteDetails = async (req, res) => {
    const auth = req.auth;
    const noteId = req.params.noteId;
    try {
        const note = await note_service_1.default.findNoteById(noteId);
        if (!note) {
            throw new NotFoundError_1.default("Note not found!");
        }
        if (!note.createdBy || note.createdBy.toString() !== auth._id.toString()) {
            throw new ForbiddenError_1.default("You are not authorized to edit this note!");
        }
        const updatedDetails = req.body;
        const updatedNote = await note_service_1.default.updateNoteDetails(noteId, updatedDetails);
        (0, responce_1.default)(res, true, http_status_codes_1.StatusCodes.OK, "Note updated successfully!", updatedNote);
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error updating Note",
            error: error.message,
        });
    }
};
exports.EditNoteDetails = EditNoteDetails;
const DeleteNote = async (req, res) => {
    const auth = req.auth;
    const noteId = req.params.noteId;
    try {
        const note = await note_service_1.default.findNoteById(noteId);
        if (!note) {
            throw new NotFoundError_1.default("Note not found!");
        }
        if (!note.createdBy || note.createdBy.toString() !== auth._id.toString()) {
            throw new ForbiddenError_1.default("You are not authorized to edit this note!");
        }
        await note_service_1.default.deleteNoteById(noteId);
        (0, responce_1.default)(res, true, http_status_codes_1.StatusCodes.OK, "Note deleted successfully!", null);
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error deleting Note",
            error: error.message,
        });
    }
};
exports.DeleteNote = DeleteNote;
const FindOneNoteById = async (req, res) => {
    const auth = req.auth;
    const noteId = req.params.noteId;
    try {
        const note = await note_service_1.default.findNoteById(noteId);
        if (!note) {
            throw new NotFoundError_1.default("Note not found!");
        }
        (0, responce_1.default)(res, true, http_status_codes_1.StatusCodes.OK, "Note retrieved successfully!", note);
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error retrieving note",
            error: error.message,
        });
    }
};
exports.FindOneNoteById = FindOneNoteById;
