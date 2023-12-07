import { z } from "zod";

export const registerSchema = z.object({
  // In this example we will only validate the request body.
  body: z.object({
    // email should be valid and non-empty
    email: z.string().email().trim(),
    username: z.string().toLowerCase().min(3),
    // password should be at least 6 characters
    password: z.string().min(6),
    role: z.enum(["ADMIN", "USER"]).optional(),
  }),
  
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().trim().optional(),
    username: z.string().trim().optional(),
    password: z.string().trim(),
  }),
});

// body("email")
//       .trim()
//       .notEmpty()
//       .withMessage("Email is required")
//       .isEmail()
//       .withMessage("Email is invalid"),
//     body("username")
//       .trim()
//       .notEmpty()
//       .withMessage("Username is required")
//       .isLowercase()
//       .withMessage("Username must be lowercase")
//       .isLength({ min: 3 })
//       .withMessage("Username must be at lease 3 characters long"),
//     body("password").trim().notEmpty().withMessage("Password is required"),
//     body("role")
//       .optional()
//       .isIn(AvailableUserRoles)
//       .withMessage("Invalid user role"),
