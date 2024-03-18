"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_middleware_1 = __importDefault(require("../middlewares/user-middleware"));
const storage_middleware_1 = __importDefault(require("../config/storage-middleware"));
const note_controller_1 = require("../controllers/note-controller");
const constants_1 = __importDefault(require("../utills/constants"));
const NoteRouter = (0, express_1.Router)();
//
NoteRouter.post("/createNote", user_middleware_1.default.authorize([constants_1.default.USER.ROLES.USER]), storage_middleware_1.default.multerUploader.single("document"), note_controller_1.CreateNote);
NoteRouter.get("/getAllNotes", user_middleware_1.default.authorize([constants_1.default.USER.ROLES.USER]), note_controller_1.FindAllNotes);
NoteRouter.post("/updateNote/:noteId", user_middleware_1.default.authorize([constants_1.default.USER.ROLES.USER]), storage_middleware_1.default.multerUploader.single("document"), note_controller_1.EditNoteDetails);
NoteRouter.get("/getOneNote/:noteId", user_middleware_1.default.authorize([constants_1.default.USER.ROLES.USER]), note_controller_1.FindOneNoteById);
NoteRouter.delete("/deleteNote/:noteId", user_middleware_1.default.authorize([constants_1.default.USER.ROLES.USER]), note_controller_1.DeleteNote);
exports.default = NoteRouter;
