import useGetConversations from "@/hooks/useGetConversations";
import Conversation from "./Conversation";
import { Loader2 } from "lucide-react";
import { getRandomEmoji } from "@/utils/emoji";

function Conversations() {
  const { isLoading, data: conversations } = useGetConversations();
  return (
    <div className="flex flex-col overflow-auto py-2">
      {conversations?.map((conversation, idx) => (
        <Conversation
          key={conversation._id}
          conversation={conversation}
          emoji={getRandomEmoji()}
          lastIdx={idx === conversations.length - 1}
        />
      ))}
      {isLoading ? <Loader2 /> : null}
    </div>
  );
}

export default Conversations;
