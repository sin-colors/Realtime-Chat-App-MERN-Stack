import { useAuthContext } from "@/context/AuthContext";
import type { RegisterType } from "@/lib/schema/authSchema";
import { toast } from "sonner";

function useSignup() {
  const { setAuthUser } = useAuthContext();
  async function signup(values: RegisterType) {
    // console.log("values: ", values);
    async function registerPromise() {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("登録に失敗しました");
      const signupData = await response.json();
      if (signupData.error) throw new Error(signupData.error);
      // console.log(signupData);
      localStorage.setItem("chat-user", JSON.stringify(signupData));

      setAuthUser(signupData);
      return signupData;
    }
    return toast.promise(registerPromise(), {
      loading: "登録しています。。。",
      success: (data) => `${data.userName} さんの登録が完了しました！`,
      error: (err) => err.message || "予期せぬエラーが発生しました",
    });
  }
  return { signup };
}
export default useSignup;

// function handleInputErrors({
//   username,
//   password,
//   confirmPassword,
//   gender,
// }: signupProps) {
//   if (!username || !password || !confirmPassword || !gender) {
//     // toast.error("すべての項目を入力してください");
//     console.log("handleInputErrors: 入力が欠けている項目があります");
//     return false;
//   }
//   if (password !== confirmPassword) {
//     // toast.error("パスワードとパスワードの確認が一致しません");
//     console.log(
//       "handleInputErrors: パスワードとパスワードの確認が一致しません",
//     );
//     return false;
//   }
//   if (password.length < 6) {
//     // toast.error("パスワードは６文字以上でなければなりません");
//     console.log(
//       "handleInputErrors: パスワードは６文字以上でなければなりません",
//     );
//     return false;
//   }
//   return true;
// }
