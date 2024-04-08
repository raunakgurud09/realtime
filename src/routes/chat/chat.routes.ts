import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middlewares";
import { validate, validateError } from "../../utils/validator";
import { mongoIdPathVariableValidator } from "../../validations/mongodb.validators";
import {
  availableUsers,
  createAGroupChat,
  createIncomingCall,
  createOrGetAOneOnOneChat,
  getAllChats,
} from "../../controllers/chat/chat.controllers";

const router = Router();

// SECURE ROUTES
router.use(verifyJWT);

router.route("/").get(getAllChats);
router.route("/users").get(availableUsers);

router
  .route("/c/:receiverId")
  .post(
    mongoIdPathVariableValidator("receiverId"),
    validateError,
    createOrGetAOneOnOneChat
  );

router.route("/call/:chatId").post(createIncomingCall);

router.route("/group").post(createAGroupChat);

export default router;
