import { NextFunction, Response, Request } from "express";
import { validationResult } from "express-validator";
import { ApiError } from "./ApiError";

export const validate =
  (schema: any): any =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (err: any) {
      return res.status(400).send(err.errors);
    }
  };

export const validateError = (req: Request, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors
    .array()
    .map((err: any) => extractedErrors.push({ [err?.path]: err.msg }));

  // 422: Unprocessable Entity
  throw new ApiError(422, "Received data is not valid", extractedErrors);
};
