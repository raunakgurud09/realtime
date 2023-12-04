import { UserRolesEnum } from "../../constants";
import { emailVerificationMailgenContent, sendEmail } from "../../lib/sendMail";
import { User, UserDocument } from "../../models/auth/user.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, username, password, role } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username, email }],
    });

    if (existingUser) {
      throw new ApiError(409, "User with email or username exists already", []);
    }

    // TODO : fix userDocument issue
    const user: any = await User.create({
      email,
      username,
      password,
      role: role || UserRolesEnum.USER,
      isEmailVerified: false,
    });

    const { unHashedToken, hashedToken, tokenExpiry } =
      user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      email: user?.email,
      subject: "Please verify your email",
      mailgen: emailVerificationMailgenContent(
        user.username,
        `${req.protocol}://${req.get(
          "host"
        )}/api/v1/users/verify-email/${unHashedToken}`
      ),
    });

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
