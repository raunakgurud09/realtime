import { AxiosResponse } from "axios";
import { APISuccessResponseInterface } from "../interface/api";
import { ChatListItemInterface } from "../interface/chat";
import { UserInterface } from "../interface/user";

export const requestHandler = async (
  api: () => Promise<AxiosResponse<APISuccessResponseInterface, any>>,
  setLoading: ((loading: boolean) => void) | null,
  onSuccess: (data: APISuccessResponseInterface) => void,
  onError: (error: string) => void
) => {
  // Show loading state if setLoading function is provided
  setLoading && setLoading(true);
  try {
    // Make the API request
    const response = await api();
    const { data } = response;
    if (data?.success) {
      // Call the onSuccess callback with the response data
      onSuccess(data);
    }
  } catch (error: any) {
    // Handle error cases, including unauthorized and forbidden cases
    if ([401, 403].includes(error?.response.data?.statusCode)) {
      localStorage.clear(); // Clear local storage on authentication issues
      if (isBrowser) window.location.href = "/login"; // Redirect to login page
    }
    onError(error?.response?.data?.message || "Something went wrong");
  } finally {
    // Hide loading state if setLoading function is provided
    setLoading && setLoading(false);
  }
};

export const isBrowser = typeof window !== "undefined";

export const classNames = (...className: string[]) => {
  // Filter out any empty class names and join them with a space
  return className.filter(Boolean).join(" ");
};

export const getChatObjectMetadata = (
  chat: ChatListItemInterface, // The chat item for which metadata is being generated.
  loggedInUser: UserInterface // The currently logged-in user details.
) => {
  // Determine the content of the last message, if any.
  // If the last message contains only attachments, indicate their count.
  const lastMessage = chat.lastMessage?.content
    ? chat.lastMessage?.content
    : chat.lastMessage
      ? `${chat.lastMessage?.attachments?.length} attachment${
          chat.lastMessage.attachments.length > 1 ? "s" : ""
        }`
      : "No messages yet"; // Placeholder text if there are no messages.

  if (chat.isGroupChat) {
    // Case: Group chat
    // Return metadata specific to group chats.
    return {
      // Default avatar for group chats.
      avatar: "https://via.placeholder.com/100x100.png",
      title: chat.name, // Group name serves as the title.
      description: `${chat.participants.length} members in the chat`, // Description indicates the number of members.
      lastMessage: chat.lastMessage
        ? chat.lastMessage?.sender?.username + ": " + lastMessage
        : lastMessage,
    };
  } else {
    // Case: Individual chat
    // Identify the participant other than the logged-in user.
    const participant = chat.participants.find(
      (p) => p._id !== loggedInUser?._id
    );
    // Return metadata specific to individual chats.
    return {
      avatar: participant?.avatar.url, // Participant's avatar URL.
      title: participant?.username, // Participant's username serves as the title.
      description: participant?.email, // Email address of the participant.
      lastMessage,
    };
  }
};
