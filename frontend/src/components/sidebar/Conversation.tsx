import useConversation, { type User } from "@/zustand/useConversation";

interface Props {
  conversation: User;
  lastIdx: boolean;
  emoji: string;
}

function Conversation({ conversation, lastIdx, emoji }: Props) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = conversation._id === selectedConversation?._id;
  return (
    <>
      <div
        className={`flex cursor-pointer items-center gap-2 rounded p-2 py-1 hover:bg-sky-500 ${isSelected ? "bg-sky-500" : ""}`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className="avatar online">
          <div className="w-12 rounded-full">
            <img
              // src="https://img.daisyui.com/images/profile/demo/gordon@192.webp"
              src={conversation.profilePic}
              alt="user avatar"
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex justify-between gap-3">
            <p className="font-bold text-gray-200">{conversation.userName}</p>
            <span className="text-xl">{emoji}</span>
          </div>
        </div>
      </div>
      {!lastIdx && <div className="divider my-0 h-1 py-0"></div>}
    </>
  );
}

export default Conversation;
