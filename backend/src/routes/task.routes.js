import { Router } from "express";
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from "../controllers/task.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import { verifyJWT, validateProjectPermission } from "../middlewares/auth.middlewares.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const router = Router();

// Apply JWT verification to all task routes
router.use(verifyJWT);

// Task routes
router
  .route("/:projectId")
  .get(validateProjectPermission(AvailableUserRole), getTasks)
  .post(verifyJWT, validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]), createTask);

router
  .route("/:projectId/t/:taskId")
  .get(validateProjectPermission(AvailableUserRole), getTaskById)
  .put(verifyJWT, validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]), updateTask)
  .delete(verifyJWT, validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]), deleteTask);

// Subtask routes
router
  .route("/:projectId/t/:taskId/subtasks")
  .post(verifyJWT, validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]), createSubTask);

router
  .route("/:projectId/st/:subTaskId")
  .put(verifyJWT, validateProjectPermission(AvailableUserRole), updateSubTask)
  .delete(verifyJWT, validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]), deleteSubTask);

export default router;