import { body } from "express-validator";
import { z } from "zod";

export const sendMessageSchema = z.object({
  body: z.object({
    content: z.string().trim().optional(),
  }),
});


export const sendMessageValidator = () => {
  return [
    body("content")
      .trim()
      .optional()
      .notEmpty()
      .withMessage("Content is required"),
  ];
};