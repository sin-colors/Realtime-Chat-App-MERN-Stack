import type { User } from "@/types";
import { create } from "zustand";

interface ConversationState {
  selectedConversation: User | null; // 後で修正する必要がある！ selectedConversationはグループチャットの可能性もある
  setSelectedConversation: (selectedConversation: User | null) => void;
}

const useConversation = create<ConversationState>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
}));
export default useConversation;

//------------------------------------React Query導入前のコード-------------------------------------------
// interface ConversationState {
//   selectedConversation: User | null; // 後で修正する必要がある！ selectedConversationはグループチャットの可能性もある
//   setSelectedConversation: (selectedConversation: User | null) => void;
//   messages: MessageType[];
//   setMessages: (messages: MessageType[]) => void;
// }

// // set関数は「前の値を捨てて、新しい値で上書きする」挙動の関数
// // setSelectedConversation("A") → 次は "A" になる
// // setSelectedConversation(["A", "B"]) → 次は ["A", "B"] になる
// // setSelectedConversation(123) → 次は 123 になる
// const useConversation = create<ConversationState>((set) => ({
//   selectedConversation: null,
//   setSelectedConversation: (selectedConversation) =>
//     set({ selectedConversation }),
//   messages: [],
//   setMessages: (messages) => set({ messages }),
// }));
// export default useConversation;
