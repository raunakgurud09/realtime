import mongoose from "mongoose";
import { User } from "../../models/auth/user.model";
import { Chat } from "../../models/chat/chat.model";
import { ApiError } from "../../utils/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { ApiResponse } from "../../utils/ApiResponse";
import { emitSocketEvent } from "../../socket/index";
import { ChatEventEnum } from "../../constants";

const chatCommonAggregation = () => {
  return [
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "participants",
        as: "participants",
        pipeline: [
          {
            $project: {
              password: 0,
              refreshToken: 0,
              forgotPasswordToken: 0,
              forgotPasswordExpiry: 0,
              emailVerificationToken: 0,
              emailVerificationExpiry: 0,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "messages",
        foreignField: "_id",
        localField: "lastMessage",
        as: "lastMessage",
        pipeline: [
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "sender",
              as: "sender",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    email: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              sender: { $first: "$sender" },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        lastMessage: { $first: "$lastMessage" },
      },
    },
  ];
};

export const createOrGetAOneOnOneChat = asyncHandler(
  async (req: any, res: Response) => {
    const { receiverId } = req.params;

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      throw new ApiError(404, "Receiver doesn't exists");
    }

    if (receiver._id.toString() === req.user._id.toString()) {
      throw new ApiError(400, "You cannot chat with yourself");
    }

    const chat = await Chat.aggregate([
      // stage 1
      {
        $match: {
          isGroupChat: false,
          $and: [
            { participants: { $elemMatch: { $eq: req.user._id } } },
            {
              participants: {
                $elemMatch: { $eq: new mongoose.Types.ObjectId(receiverId) },
              },
            },
          ],
        },
      },
      // stage 2
      ...chatCommonAggregation(),
    ]);

    // if chat exists
    if (chat.length) {
      return res
        .status(200)
        .json(new ApiResponse(200, chat[0], "Chat retrieved successfully"));
    }

    // If chat didn't existed

    const newChatInstant = await Chat.create({
      name: "One-on-one-chat",
      participants: [req.user._id, new mongoose.Types.ObjectId(receiverId)],
      admin: req.user._id,
    });

    const createdChat = await Chat.aggregate([
      {
        $match: {
          _id: newChatInstant._id,
        },
      },
      ...chatCommonAggregation(),
    ]);

    const newChat = createdChat[0];

    if (!newChat) {
      throw new ApiError(500, "Internal server error");
    }

    newChat?.participants?.forEach((participant) => {
      if (participant._id.toString() === req.user._id) return;

      // emit new chat created event
      emitSocketEvent(
        req,
        newChatInstant._id.toString(),
        ChatEventEnum.NEW_CHAT_EVENT,
        newChat
      );
    });

    res
      .status(201)
      .json(
        new ApiResponse(201, newChat, "Chat created and retrieved successfully")
      );
  }
);

export const availableUsers = asyncHandler(async (req, res) => {
  const users = await User.aggregate([
    {
      $match: {
        _id: { $ne: req.user._id },
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        email: 1,
        avatar: 1,
      },
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

export const getAllChats = asyncHandler(async (req, res) => {
  const chats = await Chat.aggregate([
    {
      $match: {
        participants: { $elemMatch: { $eq: req.user._id } }, // get all chats that have logged in user as a participant
      },
    },
    {
      $sort: {
        updatedAt: -1,
      },
    },
    ...chatCommonAggregation(),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, chats || [], "User chats fetched successfully!")
    );
});

export const createAGroupChat = asyncHandler(async (req, res) => {
  const { name, participants } = req.body;

  if (participants.includes(req.user._id.toString())) {
    throw new ApiError(
      400,
      "Participants array should not contain the group creator"
    );
  }

  // member array banana with unique members
  const members = [...new Set([...participants, req.user._id.toString()])];

  // check weather the group-chat has more than 3 members
  if (members.length < 3) {
    throw new ApiError(
      400,
      "Seems like you have passed duplicate participants."
    );
  }

  // new group-chat create karna
  const groupChat = await Chat.create({
    name,
    isGroupChat: true,
    participants: members,
    admin: req.user._id,
  });

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: groupChat._id,
      },
    },
    ...chatCommonAggregation(),
  ]);

  const payload = chat[0];

  payload.participants.forEach((participant) => {
    if (participant._id.toString() === req.user._id.toString()) return;

    emitSocketEvent(
      req,
      participant._id.toString(),
      ChatEventEnum.NEW_CHAT_EVENT,
      payload
    );
  });

  return res
    .status(201)
    .json(new ApiResponse(201, payload, "Group chat created successfully"));
});
