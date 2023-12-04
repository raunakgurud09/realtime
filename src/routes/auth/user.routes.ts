import { Router } from "express";
import { validate } from "../../utils/validator";
import { registerSchema } from "../../validations/register";
import { registerUser } from "../../controllers/auth/user.controllers";

const router = Router();

router.route("/register").post(validate(registerSchema), registerUser);

export default router;
