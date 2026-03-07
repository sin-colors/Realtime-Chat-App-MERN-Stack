import { useAuthContext } from "@/context/AuthContext";
import LogoutButton from "./LogoutButton";
import { MoveHorizontal } from "lucide-react";
import useConversation from "@/zustand/useConversation";

function MobileHeader() {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  return (
    <header className="mb-2 flex items-center justify-between p-2">
      <div className="flex items-center gap-3 text-xl font-bold text-white">
        <span>{selectedConversation?.userName}</span>
        <MoveHorizontal />
        <span>{authUser?.userName}</span>
      </div>
      <LogoutButton />
    </header>
  );
}

export default MobileHeader;
