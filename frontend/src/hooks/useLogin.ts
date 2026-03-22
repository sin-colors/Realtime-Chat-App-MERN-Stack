// import { useAuthContext } from "@/context/AuthContext";
import type { LoginType } from "@/lib/schema/authSchema";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// function useLogin() {
//   const { setAuthUser } = useAuthContext();
//   function login(values: LoginType) {
//     async function loginPromise() {
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(values),
//       });
//       const loginData = await response.json();
//       if (loginData.error) throw new Error(loginData.error);
//       localStorage.setItem("chat-user", JSON.stringify(loginData));
//       setAuthUser(loginData);
//     }
//     toast.promise(loginPromise(), {
//       loading: "ログインしています。。。",
//       success: "ログインしました",
//       error: (err) => err.message || "予期せぬエラーが発生しました",
//     });
//   }
//   return { login };
// }

function useLogin() {
  // const { setAuthUser } = useAuthContext();
  const queryClient = useQueryClient();
  async function login(values: LoginType) {
    const loginPromise = (async () => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const loginData = await response.json();
      // if (loginData.error) throw new Error(loginData.error);
      // localStorage.setItem("chat-user", JSON.stringify(loginData));
      // setAuthUser(loginData);
      queryClient.setQueryData(["authUser"], loginData);
    })();
    toast.promise(loginPromise, {
      loading: "ログインしています。。。",
      success: "ログインしました",
      error: (err) => err.message || "予期せぬエラーが発生しました",
    });
    await loginPromise;
  }
  return { login };
}
export default useLogin;
