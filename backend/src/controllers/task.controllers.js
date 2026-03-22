import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { SubTask } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("assignedTo", "avatar", "username", "fullName");

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  const files = req.files || [];

  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.originalname}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  });

  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            _id: 1,
            username: 1,
            fullName: 1,
            avatar: 1,
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              createdBy: {
                $arrayElemAt: ["$createdBy", 0],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["$assignedTo", 0],
        },
      },
    },
  ]);

  if (!task || task.length === 0) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task[0], "Task fetched successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId, taskId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const task = await Task.findOne({
    _id: new mongoose.Types.ObjectId(taskId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Check permissions - only admin or project admin can update task details
  const isAdmin = project.admin.equals(req.user._id);
  const isProjectAdmin = project.projectAdmins.some(adminId => 
    adminId.equals(req.user._id)
  );

  if (!isAdmin && !isProjectAdmin) {
    throw new ApiError(403, "Only admin or project admin can update tasks");
  }

  // Update task
  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      title,
      description,
      assignedTo: assignedTo 
        ? new mongoose.Types.ObjectId(assignedTo) 
        : undefined,
      status,
      updatedAt: Date.now(),
    },
    { new: true }
  ).populate("assignedTo", "username fullName avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const task = await Task.findOne({
    _id: new mongoose.Types.ObjectId(taskId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Check permissions - only admin or project admin can delete task
  const isAdmin = project.admin.equals(req.user._id);
  const isProjectAdmin = project.projectAdmins.some(adminId => 
    adminId.equals(req.user._id)
  );

  if (!isAdmin && !isProjectAdmin) {
    throw new ApiError(403, "Only admin or project admin can delete tasks");
  }

  // Delete associated subtasks
  await SubTask.deleteMany({ task: taskId });

  // Delete task
  await Task.findByIdAndDelete(taskId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

const createSubTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;
  const { projectId, taskId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const task = await Task.findOne({
    _id: new mongoose.Types.ObjectId(taskId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Check permissions - only admin or project admin can create subtasks
  const isAdmin = project.admin.equals(req.user._id);
  const isProjectAdmin = project.projectAdmins.some(adminId => 
    adminId.equals(req.user._id)
  );

  if (!isAdmin && !isProjectAdmin) {
    throw new ApiError(403, "Only admin or project admin can create subtasks");
  }

  const subTask = await SubTask.create({
    title,
    description,
    status: status || "todo",
    task: new mongoose.Types.ObjectId(taskId),
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, subTask, "Subtask created successfully"));
});

const updateSubTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;
  const { projectId, subTaskId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const subTask = await SubTask.findOne({
    _id: new mongoose.Types.ObjectId(subTaskId),
  });

  if (!subTask) {
    throw new ApiError(404, "Subtask not found");
  }

  // Verify the subtask belongs to a task in this project
  const task = await Task.findOne({
    _id: subTask.task,
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!task) {
    throw new ApiError(404, "Subtask not found in this project");
  }

  // Check permissions - admin, project admin, or task assignee can update subtask
  const isAdmin = project.admin.equals(req.user._id);
  const isProjectAdmin = project.projectAdmins.some(adminId => 
    adminId.equals(req.user._id)
  );
  const isAssignee = task.assignedTo?.equals(req.user._id) || false;

  if (!isAdmin && !isProjectAdmin && !isAssignee) {
    throw new ApiError(403, "Insufficient permissions to update subtask");
  }

  // Update subtask
  const updatedSubTask = await SubTask.findByIdAndUpdate(
    subTaskId,
    {
      title,
      description,
      status,
      updatedAt: Date.now(),
    },
    { new: true }
  ).populate("createdBy", "username fullName avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSubTask, "Subtask updated successfully"));
});

const deleteSubTask = asyncHandler(async (req, res) => {
  const { projectId, subTaskId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const subTask = await SubTask.findOne({
    _id: new mongoose.Types.ObjectId(subTaskId),
  });

  if (!subTask) {
    throw new ApiError(404, "Subtask not found");
  }

  // Verify the subtask belongs to a task in this project
  const task = await Task.findOne({
    _id: subTask.task,
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!task) {
    throw new ApiError(404, "Subtask not found in this project");
  }

  // Check permissions - only admin or project admin can delete subtasks
  const isAdmin = project.admin.equals(req.user._id);
  const isProjectAdmin = project.projectAdmins.some(adminId => 
    adminId.equals(req.user._id)
  );

  if (!isAdmin && !isProjectAdmin) {
    throw new ApiError(403, "Only admin or project admin can delete subtasks");
  }

  await SubTask.findByIdAndDelete(subTaskId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Subtask deleted successfully"));
});

export {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
};
