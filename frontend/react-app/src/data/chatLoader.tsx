import apiRequest from "../lib/apiRequest";
import { useAuthStore } from "../stores/auth.store";

export const ChatLoader = async () => {
  const user = useAuthStore.getState().user;

  if (!user?._id) {
    return [];
  }

  try {
    const res = await apiRequest.get(`/chats/${user._id}`);
    const chats = Array.isArray(res.data)
     ? res.data 
     : res.data.existingChats ?? []
    return  chats;
  } catch (error) {
    console.error("Failed to fetch chats:", error);
    throw error;
  }
};