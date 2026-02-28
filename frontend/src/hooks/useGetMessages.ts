import useConversation from "@/zustand/useConversation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function useGetMessages() {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  useEffect(() => {
    async function getMessages() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/messages/${selectedConversation?._id}`,
        );
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setMessages(data);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("メッセージの取得に失敗しました！");
        }
      } finally {
        setLoading(false);
      }
    }
    if (selectedConversation?._id) {
      getMessages();
    }
  }, [selectedConversation?._id, setMessages]);
  return { loading, messages };
}
export default useGetMessages;
