import useGetMessages from "@/hooks/useGetMessages";
import Message from "./Message";
import MessageSkelton from "../skeltons/MessageSkelton";

function Messages() {
  const { messages, loading } = useGetMessages();
  // console.log("messages: ", messages);
  return (
    <div className="flex-1 overflow-auto px-4">
      {loading && [...Array(3)].map((_, idx) => <MessageSkelton key={idx} />)}
      {!loading && messages.length === 0 && (
        <p className="test-center">Send a message to start the conversation</p>
      )}
      {!loading &&
        messages.length > 0 &&
        messages.map((message) => (
          <Message key={message._id} message={message} />
        ))}
    </div>
  );
}

export default Messages;
