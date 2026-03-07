import useConversation from "@/zustand/useConversation";
import { Label } from "../ui/label";
import MessageInput from "./MessageInput";
import Messages from "./Messages";

function MessageContainer() {
  const { selectedConversation, setSelectedConversation } = useConversation();
  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);
  return (
    <div className="flex w-full flex-col md:min-w-[450px]">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <div className="mb-2 hidden bg-slate-500 px-4 py-2 sm:block">
            {/* <span className="label-text">To:</span> */}
            {/* <span className="text-sm font-medium text-slate-200">To:</span> */}
            <Label className="font-normal text-slate-200">To:</Label>
            <span className="font-bold text-gray-900">
              {selectedConversation.userName}
            </span>
          </div>
          <div className="block sm:hidden">
            <MobileHeader />
          </div>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
}

export default MessageContainer;

import { TiMessages } from "react-icons/ti";
import { useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import MobileHeader from "../sidebar/MobileHeader";
function NoChatSelected() {
  const { authUser } = useAuthContext();
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2 px-4 text-center font-semibold text-gray-200 sm:text-lg md:text-xl">
        <p>Welcome! {authUser?.userName}</p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-center text-3xl md:text-6xl" />
      </div>
    </div>
  );
}
