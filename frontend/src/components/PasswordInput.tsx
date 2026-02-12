import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 1. forwardRef でラップしつつ、中の関数に名前を付ける（displayNameを省略できる）
// 2. className を分割代入で受け取り、スタイルの結合を行う
const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(function PasswordInput({ className, ...props }, ref) {
  const [showPassword, setShowPassword] = useState(false);
  console.log("showPassword: ", showPassword);
  console.log({ ...props });

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={`pr-10 ${className}`} // スタイルのマージ
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute top-0 right-0 h-full px-3 py-2 text-gray-400 hover:bg-transparent hover:text-gray-200"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
});

// 他のファイル（Signupなど）で使えるように書き出す
export default PasswordInput;
