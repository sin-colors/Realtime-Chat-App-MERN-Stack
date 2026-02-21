// import { useAuthContext } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useLogout";
import { BiLogOut } from "react-icons/bi";
// import { toast } from "sonner";

function LogoutButton() {
  const { loading, logout } = useLogout();
  // const { setAuthUser } = useAuthContext();
  // function handleLogout() {
  //   async function logoutPromise() {
  //     const response = await fetch("/api/auth/logout", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     const logoutData = await response.json();
  //     if (logoutData.error) throw new Error(logoutData.error);
  //     localStorage.removeItem("chat-user");
  //     setAuthUser(null);
  //   }
  //   toast.promise(logoutPromise(), {
  //     loading: "ログアウトしています。。。",
  //     success: "ログアウトしました",
  //     error: (err) => err.message || "予期せぬエラーが発生しました",
  //   });
  // }
  return (
    <div className="mt-auto">
      {loading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <BiLogOut
          onClick={logout}
          className="h-6 w-6 cursor-pointer text-white"
        />
      )}
    </div>
  );
}

export default LogoutButton;

// Shadcnを使っているのでこちらのボタンでも良いかと...
// import { LogOut } from "lucide-react";
// <LogOut />
