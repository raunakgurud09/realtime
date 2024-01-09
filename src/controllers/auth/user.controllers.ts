import { UserLoginType, UserRolesEnum } from "../../constants";
import { emailVerificationMailgenContent, sendEmail } from "../../lib/sendMail";
import { User, UserDocument } from "../../models/auth/user.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";
import crypto from "crypto";
import { getLocalPath, getStaticFilePath, removeLocalFile } from "../../utils/helpers";

const generateAccessAndRefreshTokens = async (userId: string) => {
  try {
    const user: any = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // attach refresh token to the user document to avoid refreshing the access token with multiple refresh tokens
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating the access token"
    );
  }
};

export const registerUser: any = asyncHandler(
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

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          { user: createdUser },
          "Users registered successfully and verification email has been sent on your email."
        )
      );
  }
);

export const loginUser: any = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    if (!username && !email) {
      throw new ApiError(400, "Username or email is required");
    }

    const user: any = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    if (user.loginType !== UserLoginType.EMAIL_PASSWORD) {
      // If user is registered with some other method, we will ask him/her to use the same method as registered.
      // This shows that if user is registered with methods other than email password, he/she will not be able to login with password. Which makes password field redundant for the SSO
      throw new ApiError(
        400,
        "You have previously registered using " +
          user.loginType?.toLowerCase() +
          ". Please use the " +
          user.loginType?.toLowerCase() +
          " login option to access your account."
      );
    }

    // Compare the incoming password with hashed password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    // get the user document ignoring the password and refreshToken field
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );

    // TODO: Add more options to make cookie more secure and reliable
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options) // set the access token in the cookie
      .cookie("refreshToken", refreshToken, options) // set the refresh token in the cookie
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken }, // send access and refresh token in response if client decides to save them by themselves
          "User logged in successfully"
        )
      );
  }
);

export const logoutUser: any = asyncHandler(async (req: any, res: Response) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

export const verifyEmail: any = asyncHandler(
  async (req: Request, res: Response) => {
    const { verificationToken } = req.params;

    if (!verificationToken) {
      throw new ApiError(400, "Email verification token is missing");
    }

    // generate a hash from the token that we are receiving
    let hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // While registering the user, same time when we are sending the verification mail
    // we have saved a hashed value of the original email verification token in the db
    // We will try to find user with the hashed token generated by received token
    // If we find the user another check is if token expiry of that token is greater than current time if not that means it is expired
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(489, "Token is invalid or expired");
    }

    // If we found the user that means the token is valid
    // Now we can remove the associated email token and expiry date as we no  longer need them
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    // Tun the email verified flag to `true`
    user.isEmailVerified = true;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(
        new ApiResponse(200, { isEmailVerified: true }, "Email is verified")
      );
  }
);

export const getCurrentUser = asyncHandler(async (req: any, res: Response) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

export const resendEmailVerification = asyncHandler(async (req, res) => {
  const user: any = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User does not exists", []);
  }

  // if email is already verified throw an error
  if (user.isEmailVerified) {
    throw new ApiError(409, "Email is already verified!");
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken(); // generate email verification creds

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
    .status(200)
    .json(new ApiResponse(200, {}, "Mail has been sent to your mail ID"));
});

export const updateUserAvatar = asyncHandler(async (req, res) => {
  // check for file
  if (!req.file?.filename) {
    throw new ApiError(400, "Avatar image is required");
  }

  const avatarUrl = getStaticFilePath(req, req.file?.filename);
  const avatarLocalUrl = getLocalPath(req.file?.filename);

  // find the user
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  // update the set for user
  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      $set: {
        avatar: {
          url: avatarUrl,
          localPath: avatarLocalUrl,
        },
      },
    },
    { new: true }
  ).select(
    "-password -refreshToken -forgotPasswordToken -emailVerificationToken -emailVerificationExpiry"
  );

  removeLocalFile(avatarLocalUrl);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "user avatar updated"));
});
