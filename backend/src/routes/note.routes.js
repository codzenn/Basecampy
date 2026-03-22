import { Router } from "express";
import {
  getNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/note.controllers.js";
import { verifyJWT, validateProjectPermission } from "../middlewares/auth.middlewares.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const router = Router();

// Apply JWT verification to all note routes
router.use(verifyJWT);

// Note routes
router
  .route("/:projectId")
  .get(validateProjectPermission(AvailableUserRole), getNotes)
  .post(verifyJWT, validateProjectPermission([UserRolesEnum.ADMIN]), createNote);

router
  .route("/:projectId/n/:noteId")
  .get(validateProjectPermission(AvailableUserRole), getNoteById)
  .put(verifyJWT, validateProjectPermission([UserRolesEnum.ADMIN]), updateNote)
  .delete(verifyJWT, validateProjectPermission([UserRolesEnum.ADMIN]), deleteNote);

export default router;