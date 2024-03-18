import { Router } from "express";
import userMiddleware from "../middlewares/user-middleware";
import commonMiddleware from "../config/storage-middleware";

import {
  CreateNote,
  DeleteNote,
  EditNoteDetails,
  FindAllNotes,
  FindOneNoteById,
} from "../controllers/note-controller";
import constants from "../utills/constants";

const NoteRouter = Router();

NoteRouter.post(
  "/createNote",
  userMiddleware.authorize([constants.USER.ROLES.USER]),
  commonMiddleware.multerUploader.single("document"),
  CreateNote
);

NoteRouter.get(
  "/getAllNotes",
  userMiddleware.authorize([constants.USER.ROLES.USER]),
  FindAllNotes
);

NoteRouter.post(
  "/updateNote/:noteId",
  userMiddleware.authorize([constants.USER.ROLES.USER]),
  commonMiddleware.multerUploader.single("document"),
  EditNoteDetails
);

NoteRouter.get(
  "/getOneNote/:noteId",
  userMiddleware.authorize([constants.USER.ROLES.USER]),
  FindOneNoteById
);

NoteRouter.delete(
  "/deleteNote/:noteId",
  userMiddleware.authorize([constants.USER.ROLES.USER]),
  DeleteNote
);

export default NoteRouter;
