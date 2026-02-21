// function Login() {
//   return (
//     <div className="mx-auto flex min-w-96 flex-col items-center justify-center">
//       <div className="w-full rounded-lg bg-gray-400/0 bg-clip-padding p-6 shadow-md backdrop-blur-lg backdrop-filter">
//         <h1 className="text-center text-3xl font-semibold text-gray-300">
//           Login
//           <span className="text-blue-500"> Chat App</span>
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
//             <button className="btn btn-block btn-sm mt-2 bg-gray-700/50">
//               ログイン
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;

// 1. "use client" は削除
import { Link } from "react-router-dom"; // next/link から変更
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

const formSchema = z.object({
  userName: z.string().min(2, {
    message: "ユーザー名は2文字以上で入力してください。",
  }),
  password: z.string().min(6, {
    message: "パスワードは6文字以上で入力してください。",
  }),
});

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="flex min-h-screen min-w-96 items-center justify-center p-4">
      <Card className="w-full max-w-md border-gray-800 bg-gray-400/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-semibold text-gray-100">
            Login
            <span className="text-blue-500"> Chat App</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userName"
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
                      <Input
                        type="password"
                        placeholder="パスワードを入力してください"
                        className="border-gray-700 bg-gray-900/50 text-white placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="text-sm text-gray-300">
                アカウントを持っていない方は
                <Link
                  to="/signup" // href(Next.js) から to(react-router-dom) に変更
                  className="mx-1 inline-block text-yellow-500 hover:text-yellow-400 hover:underline"
                >
                  アカウント作成
                </Link>
                へ
              </p>

              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                ログイン
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
