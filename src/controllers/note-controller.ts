import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import noteService from "../services/note-service";
import userService from "../services/user-service";
import CustomResponse from "../utills/responce";

import commonService from "../config/storage-config";

import NotFoundError from "../utills/error/error.classes/NotFoundError";
import BadRequestError from "../utills/error/error.classes/BadRequestError";
import ForbiddenError from "../utills/error/error.classes/ForbiddenError";

import Note from "../models/note-model";

import constants from "../utills/constants";

const CreateNote = async (req: Request, res: Response) => {
  const body = req.body;
  const auth = req.auth;
  let file: any = req.file;

  //console.log(req.body);

  let createdNote: any = null;

  try {
    let documentUri = ""; // Initialize document URI variable

    // Upload the file if provided

    let uploadedDocument: any = null;

    if (file) {
      uploadedDocument = await commonService.uploadImageAndGetUri(
        file,
        constants.CLOUDINARY.FILE_NAME + "/notes"
      );
      if (documentUri != null) {
        documentUri = uploadedDocument.uri.toString();
      }
    }

    const newNote = new Note({
      title: body.title,
      content: body.content,
      category: body.category || "General",
      document: documentUri,
      reminders: body.reminders || "",
      createdBy: auth._id,
    });

    createdNote = await noteService.save(newNote, null);

    CustomResponse(
      res,
      true,
      StatusCodes.CREATED,
      "Note created successfully!",
      createdNote
    );
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error creating Note",
      error: error.message,
    });
  }
};

const FindAllNotes = async (req: Request, res: Response) => {
  const auth: any = req.auth;

  try {
    const userNotes = await noteService.findAllByCreatedBy(auth._id);

    CustomResponse(
      res,
      true,
      StatusCodes.OK,
      "Your notes retrieved successfully!",
      userNotes
    );
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error retrieving notes",
      error: error.message,
    });
  }
};

const EditNoteDetails = async (req: Request, res: Response) => {
  const auth: any = req.auth;
  const noteId = req.params.noteId;

  try {
    const note = await noteService.findNoteById(noteId);

    if (!note) {
      throw new NotFoundError("Note not found!");
    }

    if (!note.createdBy || note.createdBy.toString() !== auth._id.toString()) {
      throw new ForbiddenError("You are not authorized to edit this note!");
    }

    const updatedDetails = req.body;
    const updatedNote = await noteService.updateNoteDetails(
      noteId,
      updatedDetails
    );

    CustomResponse(
      res,
      true,
      StatusCodes.OK,
      "Note updated successfully!",
      updatedNote
    );
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error updating Note",
      error: error.message,
    });
  }
};

const DeleteNote = async (req: Request, res: Response) => {
  const auth: any = req.auth;
  const noteId = req.params.noteId;

  try {
    const note = await noteService.findNoteById(noteId);

    if (!note) {
      throw new NotFoundError("Note not found!");
    }

    if (!note.createdBy || note.createdBy.toString() !== auth._id.toString()) {
      throw new ForbiddenError("You are not authorized to edit this note!");
    }

    await noteService.deleteNoteById(noteId);

    CustomResponse(
      res,
      true,
      StatusCodes.OK,
      "Note deleted successfully!",
      null
    );
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error deleting Note",
      error: error.message,
    });
  }
};

const FindOneNoteById = async (req: Request, res: Response) => {
  const auth: any = req.auth;
  const noteId = req.params.noteId;

  try {
    const note = await noteService.findNoteById(noteId);

    if (!note) {
      throw new NotFoundError("Note not found!");
    }

    CustomResponse(
      res,
      true,
      StatusCodes.OK,
      "Note retrieved successfully!",
      note
    );
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error retrieving note",
      error: error.message,
    });
  }
};

export {
  CreateNote,
  FindAllNotes,
  EditNoteDetails,
  DeleteNote,
  FindOneNoteById,
};
