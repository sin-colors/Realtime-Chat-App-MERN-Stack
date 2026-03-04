import { useSocketContext } from "@/context/SocketContext";
import useConversation from "@/zustand/useConversation";
import { useEffect } from "react";

function useListenMessage() {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setMessages([...messages, newMessage]);
    });
    return () => {
      socket?.off("newMessage");
    };
  }, [socket, messages, setMessages]);
}

export default useListenMessage;
