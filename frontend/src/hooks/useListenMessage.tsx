import { useSocketContext } from "@/context/SocketContext";
import type { MessageType } from "@/types";
import useConversation from "@/zustand/useConversation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

function useListenMessage() {
  const { socket } = useSocketContext();
  const { selectedConversation } = useConversation();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!socket) return;
    function handleNewMessage(newMessage: MessageType) {
      // 受信したメッセージが、現在開いているチャット相手のものか確認
      // (相手が自分に送ってきた場合 senderId、自分が別端末で送った場合 receiverId など)
      const isRelevant =
        newMessage.senderId === selectedConversation?._id ||
        newMessage.receiverId === selectedConversation?._id;
      if (isRelevant) {
        // React Query のキャッシュを更新
        queryClient.setQueryData<MessageType[]>(
          ["messages", selectedConversation._id],
          (oldMessages) => {
            // 重複チェック（稀に送信時の onSuccess と Socket が重複することがあるため
            const exists = oldMessages?.some((m) => m._id === newMessage._id);
            if (exists) return oldMessages;
            return [...(oldMessages || []), newMessage];
          },
        );
      }
    }
    socket?.on("newMessage", handleNewMessage);

    return () => {
      socket?.off("newMessage");
    };
  }, [socket, selectedConversation?._id, queryClient]);

  useEffect(() => {
    if (!socket) return;
    function handleMessagesRead({
      conversationId,
    }: {
      conversationId: string;
    }) {
      if (conversationId === selectedConversation?._id) {
        queryClient.setQueryData<MessageType[]>(
          ["messages", conversationId],
          (oleMessage) =>
            oleMessage?.map((message) => ({ ...message, isRead: true })),
        );
      }
    }
    socket.on("messagesRead", handleMessagesRead);
    return () => {
      socket?.off("messagesRead");
    };
  }, [socket, selectedConversation?._id, queryClient]);
}

export default useListenMessage;

//---------------------------React Query導入前のコード-----------------------------
// function useListenMessage() {
//   const { socket } = useSocketContext();
//   const { messages, setMessages } = useConversation();
//   useEffect(() => {
//     socket?.on("newMessage", (newMessage) => {
//       setMessages([...messages, newMessage]);
//     });
//     return () => {
//       socket?.off("newMessage");
//     };
//   }, [socket, messages, setMessages]);
// }

// export default useListenMessage;
//-------------------------------------------------------------------------
