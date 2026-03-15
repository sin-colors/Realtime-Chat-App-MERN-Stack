// 自作のSettingsコンポーネントを書いているため、名前がかぶるのを避けるため別名で使用した
import { Settings as SettingsIcon } from "lucide-react";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Sidebar({ showMessageMenu = false }: { showMessageMenu?: boolean }) {
  const location = useLocation();
  const isSettingsPage = location.pathname === "/settings";
  return (
    <div className="flex flex-col border-r border-slate-500 p-4">
      {showMessageMenu && (
        <>
          <SearchInput />
          <div className="divider px-3"></div>
          <Conversations />
        </>
      )}
      {!showMessageMenu && (
        <Link to="/">
          <div className="p-2 text-white">チャットに戻る</div>
        </Link>
      )}
      <div className="flex items-center gap-4 p-2">
        {!isSettingsPage && (
          <Link to={"/settings"}>
            <SettingsIcon className="h-6 w-6 cursor-pointer text-white" />
          </Link>
        )}
        <LogoutButton />
      </div>
    </div>
  );
}

export default Sidebar;
