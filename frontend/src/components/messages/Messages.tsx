import useGetMessages from "@/hooks/useGetMessages";
import Message from "./Message";
import MessageSkelton from "../skeltons/MessageSkelton";
import { useEffect, useRef } from "react";
import useListenMessage from "@/hooks/useListenMessage";
import useConversation from "@/zustand/useConversation";
import { useMarkAsRead } from "@/hooks/useMarkAsRead";

function Messages() {
  const { data: messages = [], isLoading } = useGetMessages();
  // console.log("messages: ", messages);
  const { selectedConversation } = useConversation();
  const { mutate: markAsRead } = useMarkAsRead();
  useListenMessage();
  const messageRef = useRef<HTMLDivElement>(null);
  // 1. 会話を開いた時、または新しいメッセージが届いた時に既読にする
  useEffect(() => {
    if (selectedConversation?._id && messages.length > 0) {
      // 最後のメッセージが相手からのもので、かつ未読なら既読APIを叩く
      const lastMessage = messages[messages.length - 1];
      const isLastMessageFromOther =
        lastMessage.senderId === selectedConversation._id;
      if (isLastMessageFromOther && !lastMessage.isRead) {
        markAsRead(selectedConversation._id);
      }
    }
    setTimeout(() => {
      messageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [selectedConversation?._id, messages.length, markAsRead]);
  return (
    <div className="flex-1 overflow-auto px-4">
      {isLoading && [...Array(3)].map((_, idx) => <MessageSkelton key={idx} />)}
      {!isLoading && messages.length === 0 && (
        <p className="test-center">Send a message to start the conversation</p>
      )}
      {!isLoading &&
        messages.length > 0 &&
        messages.map((message) => (
          <div key={message._id} ref={messageRef}>
            <Message message={message} />
          </div>
        ))}
    </div>
  );
}

export default Messages;
