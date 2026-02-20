import { useState } from "react";

interface signupProps {
  username: string;
  password: string;
  confirmPassword: string;
  gender: "male" | "female";
}

function useSignup() {
  const [loading, setLoading] = useState<boolean>(false);
  async function signup({
    username,
    password,
    confirmPassword,
    gender,
  }: signupProps) {
    const success = handleInputErrors({
      username,
      password,
      confirmPassword,
      gender,
    });
    if (!success) return;
    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username, password, confirmPassword, gender }),
      });
      const data = await response.json();
      console.log(data);
    } catch (err) {
      // toast.error(err.message);
      if (err instanceof Error) {
        console.log(err.message);
      } else {
        console.log(err);
      }
    } finally {
      setLoading(false);
    }
  }
  return { loading, signup };
}
export default useSignup;

function handleInputErrors({
  username,
  password,
  confirmPassword,
  gender,
}: signupProps) {
  if (!username || !password || !confirmPassword || !gender) {
    // toast.error("すべての項目を入力してください");
    console.log("handleInputErrors: 入力が欠けている項目があります");
    return false;
  }
  if (password !== confirmPassword) {
    // toast.error("パスワードとパスワードの確認が一致しません");
    console.log(
      "handleInputErrors: パスワードとパスワードの確認が一致しません",
    );
    return false;
  }
  if (password.length < 6) {
    // toast.error("パスワードは６文字以上でなければなりません");
    console.log(
      "handleInputErrors: パスワードは６文字以上でなければなりません",
    );
    return false;
  }
  return true;
}
