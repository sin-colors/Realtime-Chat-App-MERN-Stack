import { useAuthContext } from "@/context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  function logout() {
    setLoading(true);
    async function logoutPromise() {
      try {
        const response = await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const logoutData = await response.json();
        if (logoutData.error) throw new Error(logoutData.error);
        localStorage.removeItem("chat-user");
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    }
    toast.promise(logoutPromise(), {
      loading: "ログアウトしています。。。",
      success: "ログアウトしました",
      error: (err) => err.message || "予期せぬエラーが発生しました",
    });
  }
  return { loading, logout };
}
