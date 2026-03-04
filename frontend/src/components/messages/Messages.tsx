import useGetMessages from "@/hooks/useGetMessages";
import Message from "./Message";
import MessageSkelton from "../skeltons/MessageSkelton";
import { useEffect, useRef } from "react";
import useListenMessage from "@/hooks/useListenMessage";

function Messages() {
  const { data: messages = [], isLoading } = useGetMessages();
  // console.log("messages: ", messages);
  useListenMessage();
  const messageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setTimeout(() => {
      // この設定だと一番上に表示されるような気がする。。。
      // うまく機能しない場合は、scrollIntoViewのオプションにblock:"end"を追加する
      messageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);
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
