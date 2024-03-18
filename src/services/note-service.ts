import Note from "../models/note-model";

const save = async (note: any, session: any) => {
  if (session) {
    return await note.save({ session });
  } else {
    return await note.save();
  }
};

const findAllNotes = () => {
  return Note.find({}).populate("createdBy");
};

const findAllByCreatedBy = (createdBy: any) => {
  return Note.find({
    createdBy,
  });
};

const findNoteById = (id: any) => {
  return Note.findOne({ _id: id });
};

const updateNoteDetails = async (id: any, updatedDetails: any) => {
  return await Note.findByIdAndUpdate(id, updatedDetails, { new: true });
};

const deleteNoteById = async (noteId: any) => {
  return await Note.findByIdAndDelete(noteId);
};

export default {
  save,
  findAllByCreatedBy,
  findNoteById,
  findAllNotes,
  updateNoteDetails,
  deleteNoteById,
};
