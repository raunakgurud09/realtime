import { Router } from "express";
import { validate } from "../../utils/validator";
import { loginSchema, registerSchema } from "../../validations/auth.validation";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  resendEmailVerification,
  updateUserAvatar,
  verifyEmail,
} from "../../controllers/auth/user.controllers";
import { verifyJWT } from "../../middlewares/auth.middlewares";
import { upload } from "../../middlewares/multer.middlewares";

const router = Router();

router.route("/register").post(validate(registerSchema), registerUser);
router.route("/login").post(validate(loginSchema), loginUser);
router.route("/verify-email/:verificationToken").get(verifyEmail);
// router.route("/refresh-token").post(refreshAccessToken);

// router.route("/refresh-token").post(refreshAccessToken);

// SECURE ROUTES

router.route("/current-user").get(verifyJWT, getCurrentUser);
router
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerification);

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

export default router;
