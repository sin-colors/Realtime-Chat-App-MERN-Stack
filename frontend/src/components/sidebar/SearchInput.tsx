import { IoSearchSharp } from "react-icons/io5";
function SearchInput() {
  return (
    <form className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search..."
        className="input focus:outline-base-content/20 rounded-full border border-gray-600 bg-gray-700/50 px-3 text-white placeholder-gray-400 transition-all focus:outline-2 focus:outline-offset-2"
      />
      <button type="submit" className="btn btn-circle bg-sky-500 text-white">
        <IoSearchSharp />
      </button>
    </form>
  );
}

export default SearchInput;
