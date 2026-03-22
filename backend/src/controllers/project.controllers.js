import { projectService } from "../services/project.service.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";

const getProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getProjects(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await projectService.getProjectById(projectId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project fetched successfully"));
});

const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.body, req.user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, { project }, "Project created successfully"));
});

const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await projectService.updateProject(projectId, req.body, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, { project }, "Project updated successfully"));
});

const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const result = await projectService.deleteProject(projectId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Project deleted successfully"));
});

const addMembersToProject = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const { projectId } = req.params;
  
  try {
    const member = await projectService.addMember(projectId, req.user._id, email, role);

    return res
      .status(201)
      .json(new ApiResponse(201, member, "Project member added successfully"));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Error adding member");
  }
});

const getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const members = await projectService.getProjectMembers(projectId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, members, "Project members fetched successfully"));
});

const updateMemberRole = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;
  const { newRole } = req.body;
  
  const member = await projectService.updateMemberRole(projectId, req.user._id, userId, newRole);

  return res
    .status(200)
    .json(new ApiResponse(200, member, "Member role updated successfully"));
});

const deleteMember = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;
  const result = await projectService.removeMember(projectId, req.user._id, userId);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Project member deleted successfully"));
});

export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMembersToProject,
  getProjectMembers,
  updateMemberRole,
  deleteMember,
};
