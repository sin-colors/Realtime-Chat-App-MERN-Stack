import { Link } from "react-router-dom"; // next/link から変更
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// import GenderCheckbox from "./GenderCheckbox";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PasswordInput from "@/components/PasswordInput";
// import useSignup from "@/hooks/useSignup";
import { toast } from "sonner";
const formSchema = z
  .object({
    username: z.string().min(2, {
      message: "ユーザー名は2文字以上で入力してください。",
    }),
    password: z.string().min(6, {
      message: "パスワードは6文字以上で入力してください。",
    }),
    confirmPassword: z.string().min(6, {
      message: "パスワードは6文字以上で入力してください。",
    }),
    // manCheckbox: z.boolean(),
    // womanCheckbox: z.boolean(),
    gender: z.enum(["male", "female"], {
      message: "性別を選択してください。",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません。",
    path: ["confirmPassword"],
  });

function Signup() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      // manCheckbox: false,
      // womanCheckbox: false,
      gender: undefined,
    },
  });

  // const { loading, signup } = useSignup();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("values: ", values);
    // await signup(values);
    // const success = handleInputErrors(values);
    // if (!success) return;
    async function registerPromise() {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("登録に失敗しました");
      const signupData = await response.json();
      console.log(signupData);
      return signupData;
    }
    toast.promise(registerPromise(), {
      loading: "登録しています。。。",
      success: (data) => `${data.userName} さんの登録が完了しました！`,
      error: (err) => err.message || "予期せぬエラーが発生しました",
    });
  }
  return (
    <div className="flex min-h-screen min-w-96 items-center justify-center p-4">
      <Card className="w-full max-w-md border-gray-800 bg-gray-400/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-semibold text-gray-100">
            ユーザー作成
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">ユーザー名</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ユーザー名を入力してください"
                        className="border-gray-700 bg-gray-900/50 text-white placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">パスワード</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="パスワードを入力してください"
                        className="border-gray-700 bg-gray-900/50 text-white placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">
                      パスワードの確認
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="パスワードを再度入力してください"
                        className="border-gray-700 bg-gray-900/50 text-white placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-6"
                      >
                        <FormItem className="flex items-center space-y-0 space-x-2">
                          <FormControl>
                            <RadioGroupItem
                              value="male"
                              className="border-gray-500 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                            />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-300">
                            男
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-y-0 space-x-2">
                          <FormControl>
                            <RadioGroupItem
                              value="female"
                              className="border-gray-500 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                            />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-300">
                            女
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <div className="flex items-center justify-start gap-6 py-2">
                <FormField
                  control={form.control}
                  name="manCheckbox"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-y-0 space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-gray-500 data-[state=checked]:bg-blue-600"
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer text-sm font-normal text-gray-300">
                        男
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="womanCheckbox"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-y-0 space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-gray-500 data-[state=checked]:bg-blue-600"
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer text-sm font-normal text-gray-300">
                        女
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div> */}

              <p className="text-sm text-gray-300">
                アカウントを持っている方は
                <Link
                  to="/login" // href(Next.js) から to(react-routero-dom) に変更
                  className="mx-1 inline-block text-yellow-500 hover:text-yellow-400 hover:underline"
                >
                  ログインへ
                </Link>
                へ
              </p>

              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                登録
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

// function Signup() {
//   return (
//     <div className="mx-auto flex min-w-96 flex-col items-center justify-center">
//       <div className="bg-opacity-0 w-full rounded-lg bg-gray-400/0 bg-clip-padding p-6 shadow-md backdrop-blur-lg backdrop-filter">
//         <h1 className="text-center text-3xl font-semibold text-gray-300">
//           ユーザー作成
//         </h1>
//         <form>
//           <div>
//             <label className="label p-2">
//               <span className="text-sm font-medium text-gray-300/80">
//                 Username
//               </span>
//             </label>
//             <input
//               type="text"
//               placeholder="ユーザー名を入力してください"
//               className="input focus:outline-base-content/20 h-10 w-full rounded-lg border border-gray-600 bg-gray-700/50 px-3 text-white placeholder-gray-400 transition-all focus:outline-2 focus:outline-offset-2"
//             />
//           </div>
//           <div>
//             <label className="label p-2">
//               <span className="text-sm font-medium text-gray-300/80">
//                 Password
//               </span>
//             </label>
//             <input
//               type="password"
//               placeholder="パスワードを入力してください"
//               className="input focus:outline-base-content/20 h-10 w-full rounded-lg border border-gray-600 bg-gray-700/50 px-3 text-white placeholder-gray-400 transition-all focus:outline-2 focus:outline-offset-2"
//             />
//           </div>
//           <div>
//             <label className="label p-2">
//               <span className="text-sm font-medium text-gray-300/80">
//                 Confirm Password
//               </span>
//             </label>
//             <input
//               type="password"
//               placeholder="パスワードを再度入力してください"
//               className="input focus:outline-base-content/20 h-10 w-full rounded-lg border border-gray-600 bg-gray-700/50 px-3 text-white placeholder-gray-400 transition-all focus:outline-2 focus:outline-offset-2"
//             />
//           </div>
//           <GenderCheckbox />
//           <p className="mt-2 text-sm">
//             アカウントを持っていない方は
//             <a
//               href="#"
//               className="mx-1 inline-block hover:text-blue-600 hover:underline"
//             >
//               アカウント作成
//             </a>
//             へ
//           </p>

//           <div>
//             <button className="btn btn-block btn-sm mt-2 border border-slate-700 bg-gray-700/50">
//               登録
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

export default Signup;
