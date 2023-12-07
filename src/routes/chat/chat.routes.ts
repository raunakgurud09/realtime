import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middlewares";
import { validate, validateError } from "../../utils/validator";
import { mongoIdPathVariableValidator } from "../../validations/mongodb.validators";
import { availableUsers, createOrGetAOneOnOneChat } from "../../controllers/chat/chat.controllers";

const router = Router();

// SECURE ROUTES
router.use(verifyJWT);

router.route('/available-users').get(availableUsers)

router
  .route("/c/:receiverId")
  .post(
    mongoIdPathVariableValidator("receiverId"),
    validateError,
    createOrGetAOneOnOneChat
  );

export default router;
