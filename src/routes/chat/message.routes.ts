import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middlewares";
import { validate, validateError } from "../../utils/validator";
import { mongoIdPathVariableValidator } from "../../validations/mongodb.validators";
import {
  getAllMessages,
  sendMessage,
} from "../../controllers/chat/message.controllers";
import {
  sendMessageSchema,
  sendMessageValidator,
} from "../../validations/chat.validation";
import { upload } from "../../middlewares/multer.middlewares";

const router = Router();

router.use(verifyJWT);

router
  .route("/:chatId")
  .get(mongoIdPathVariableValidator("chatId"), validateError, getAllMessages)
  .post(
    upload.fields([{ name: "attachments", maxCount: 5 }]),
    mongoIdPathVariableValidator("chatId"),
    validateError,
    validate(sendMessageSchema), // not working
    sendMessage
  );

export default router;
