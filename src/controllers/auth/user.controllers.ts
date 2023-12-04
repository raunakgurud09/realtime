import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, username, password, role } = req.body;
    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          { ...req.body },
          "Users registered successfully and verification email has been sent on your email."
        )
      );
  }
);
