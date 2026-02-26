import { create } from "zustand";

export interface User {
  _id: string; // MongoDBのObjectIdはJSONでは文字列になる
  userName: string;
  gender: "male" | "female";
  profilePic: string;
  createdAt: string; // timestamps: true により生成。JSONではISO文字列
  updatedAt: string; // 同上
  // password は .select("-password") で除外されているため含まれない
}

interface ConversationState {
  selectedConversation: User | null; // 本来はUser型など
  setSelectedConversation: (selectedConversation: User | null) => void;
  messages: string[];
  setMessages: (messages: string[]) => void;
}

// set関数は「前の値を捨てて、新しい値で上書きする」挙動の関数
// setSelectedConversation("A") → 次は "A" になる
// setSelectedConversation(["A", "B"]) → 次は ["A", "B"] になる
// setSelectedConversation(123) → 次は 123 になる
const useConversation = create<ConversationState>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
}));
export default useConversation;
