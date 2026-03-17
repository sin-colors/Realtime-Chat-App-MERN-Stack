import PasswordInput from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const schema = z.object({
  currentUserName: z.string(),
  newUserName: z.string(),
  password: z.string(),
});
type Schema = z.infer<typeof schema>;

// APIを叩く関数
async function changeUserName(data: Schema) {
  const response = await fetch("/api/users/change-username", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `通信エラーが発生しました(Status: ${response.status})`,
    );
  }
  return response.json();
}

function ChangeUserNameForm() {
  const { authUser } = useAuthContext();
  const queryClient = useQueryClient();
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentUserName: "",
      newUserName: "",
      password: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: changeUserName,
    onSuccess: () => {
      toast.success("ユーザー名を変更しました");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      form.reset({ newUserName: "", password: "" });
    },
  });
  function onSubmit(value: Schema) {
    mutate(value);
  }
  return (
    <div className="flex min-h-screen min-w-96 items-center justify-center p-4">
      <Card className="w-full max-w-md border-gray-800 bg-gray-400/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-semibold text-gray-100">
            ユーザー名の変更
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-8 text-white">
            新しいユーザー名と現在のパスワードを入力してください
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col justify-center gap-4">
                <FormField
                  name="currentUserName"
                  control={form.control}
                  render={({ field: { value, ...otherField } }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">
                        現在のユーザー名
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="現在のユーザー名を入力してください"
                          value={authUser?.userName}
                          className="border-gray-700 bg-gray-900/50 text-white placeholder:text-gray-500"
                          {...otherField}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="newUserName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">
                        新しいユーザー名
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="山田太郎"
                          className="border-gray-700 bg-gray-900/50 text-white placeholder:text-gray-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">
                        パスワード
                      </FormLabel>
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
                <Button
                  type="submit"
                  className="mt-2 w-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isPending ? (
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  ) : (
                    "登録"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ChangeUserNameForm;
