import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectNote as Note } from "../models/note.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const getNotes = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const notes = await Note.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("createdBy", "username fullName avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

const createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const note = await Note.create({
    title,
    content,
    project: new mongoose.Types.ObjectId(projectId),
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, note, "Note created successfully"));
});

const getNoteById = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findById(noteId).populate(
    "createdBy",
    "username fullName avatar"
  );

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note fetched successfully"));
});

const updateNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const { noteId } = req.params;

  const note = await Note.findById(noteId);

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  // Check if user is admin
  const project = await Project.findById(note.project);
  const isAdmin = project?.admin.equals(req.user._id);

  if (!isAdmin) {
    throw new ApiError(403, "Only admin can update notes");
  }

  const updatedNote = await Note.findByIdAndUpdate(
    noteId,
    {
      title,
      content,
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedNote, "Note updated successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findById(noteId);

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  // Check if user is admin
  const project = await Project.findById(note.project);
  const isAdmin = project?.admin.equals(req.user._id);

  if (!isAdmin) {
    throw new ApiError(403, "Only admin can delete notes");
  }

  await Note.findByIdAndDelete(noteId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Note deleted successfully"));
});

export {
  getNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
};