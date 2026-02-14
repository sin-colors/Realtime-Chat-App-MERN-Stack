import Conversations from "./Conversations";
import SearchInput from "./SearchInput";

function Sidebar() {
  return (
    <div className="flex flex-col border-r border-slate-500 p-4">
      <SearchInput />
      <div className="divider px-3"></div>
      <Conversations />
      {/* <LogoutButton /> */}
    </div>
  );
}

export default Sidebar;
