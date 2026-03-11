import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BsSend } from "react-icons/bs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useConversation from "@/zustand/useConversation";
import { toast } from "sonner";
import { BookImage, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MessageType } from "@/types";
import { Textarea } from "../ui/textarea";
import {
  messageInputSchema,
  type MessageInputType,
} from "@/lib/schema/messageSchema";
import { useEffect, useRef, useState } from "react";
import FilePreview from "../FilePreview";

interface SendMessageProps {
  message: string;
  images: string[];
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

function MessageInput() {
  const form = useForm<MessageInputType>({
    resolver: zodResolver(messageInputSchema),
    defaultValues: {
      message: "",
      images: null,
    },
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const files = form.watch("images");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const urlsRef = useRef<string[]>([]);
  const { selectedConversation } = useConversation();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (value: SendMessageProps) => {
      console.log("value_in_mutate: ", value);
      const response = await fetch(
        `/api/messages/send/${selectedConversation?._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        },
      );
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      return data as MessageType;
    },
    onSuccess: (newMessage) => {
      // 送信成功時、キャッシュを直接更新して画面に即座に反映させる
      queryClient.setQueryData<MessageType[]>(
        ["messages", selectedConversation?._id],
        (oldMessages) => [...(oldMessages || []), newMessage],
      );
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("メッセージの送信に失敗しました！");
      }
    },
    onSettled: () => {
      form.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
      setImageUrls([]);
    },
  });

  useEffect(() => {
    return () => {
      urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      // imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // フォームを送信する際にFileオブジェクトの配列をBase64文字列の配列に変換してから送信する
  async function onSubmit(value: MessageInputType) {
    if (!value.message.trim() && !value.images) return;
    // console.log("value: ", value);
    // console.log("value.images: ", value.images);
    let base64Images: string[] = [];
    // 画像がある場合、すべてBase64に変換
    if (value.images && value.images.length > 0) {
      base64Images = await Promise.all(
        Array.from(value.images).map((file) => fileToBase64(file)),
      );
    }
    // console.log("base64Images: ", base64Images);
    // サーバーに送る形式に作り替える
    const payload: SendMessageProps = {
      message: value.message,
      images: base64Images, // 文字列の配列として送る
    };

    mutate(payload); // mutateに渡す
  }

  function handleFilePreviewRemove(index: number) {
    // 削除対象となるURLを先に取得しておく
    const urlToRevoke = imageUrls[index];
    // Stateの更新
    setImageUrls((prevImageUrls) =>
      prevImageUrls.filter((_, idx) => idx !== index),
    );
    // React Hook Formの値を更新
    if (files) {
      const updateImageUrls = files.filter((_, idx) => idx !== index);
      // フォームのフィールドの更新
      form.setValue("images", updateImageUrls);
    }
    // inputの値をリセット（同じファイルを再度選択できるようにするため）
    if (fileInputRef.current) {
      // <input />のvalueを空（空文字）にする
      fileInputRef.current.value = "";
    }
    // メモリ解放（対象のURLだけを無効化する）
    if (urlToRevoke) {
      URL.revokeObjectURL(urlToRevoke);
      urlsRef.current = urlsRef.current.filter((u) => u !== urlToRevoke);
    }
  }

  return (
    <div className="bg-white">
      {imageUrls.length > 0 && (
        <FilePreview
          imageUrls={imageUrls}
          onRemove={handleFilePreviewRemove}
          disabled={isPending}
        />
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-2">
          <div className="flex items-center gap-1.5">
            <FormField
              control={form.control}
              name="images"
              render={({
                field: { onChange, onBlur, name, ref, disabled },
              }) => (
                <FormItem>
                  <FormLabel className="inset-y-0 end-0 flex items-center rounded p-1.5">
                    <BookImage className="cursor-pointer" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={"file"}
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const newFiles = Array.from(e.target.files); // FileList → [File, File, ...]
                          const newImageUrls = newFiles.map((file) =>
                            URL.createObjectURL(file),
                          );
                          setImageUrls((prevImageUrls) => [
                            ...prevImageUrls,
                            ...newImageUrls,
                          ]);
                          urlsRef.current = [
                            ...urlsRef.current,
                            ...newImageUrls,
                          ];
                          const currentFiles = form.getValues("images") || [];
                          onChange([...currentFiles, ...newFiles]);
                        } else {
                          setImageUrls([]);
                          onChange(null);
                        }
                      }}
                      ref={(instance) => {
                        // instanceには<input>要素のDOMインスタンスが入る
                        ref(instance); // React Hook Formがフォーム要素を管理するための指定
                        fileInputRef.current = instance; // useRefを用いて作成した参照にDOM要素(<input />)をセット→DOM要素を直接操作するための指定
                      }}
                      name={name}
                      onBlur={onBlur}
                      disabled={isPending || disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea
                      rows={1}
                      placeholder="send a message"
                      className="block h-auto max-h-20 min-h-0 w-full overflow-y-scroll rounded-lg border border-gray-600 bg-gray-700 text-sm text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant={"ghost"}
              className="inset-y-0 end-0 flex cursor-pointer items-center px-3"
            >
              {isPending ? (
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              ) : (
                <BsSend />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default MessageInput;

//---------------------------------画像機能追加前のUI----------------------------------------

{
  /* <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="my-3 px-4">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="relative w-full">
              <FormControl>
                <Input
                  placeholder="send a message"
                  className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white"
                  {...field}
                />
              </FormControl>
              <Button
                type="submit"
                variant={"ghost"}
                className="absolute inset-y-0 end-0 flex items-center px-3"
              >
                {isPending ? (
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                ) : (
                  <BsSend />
                )}
              </Button>
            </FormItem>
          )}
        />
        <FormMessage />
      </form>
    </Form> */
}

//------------------------------React Query導入前のコード----------------------------------
// function MessageInput() {
//   const form = useForm<MessageInputType>({
//     resolver: zodResolver(messageInputSchema),
//     defaultValues: {
//       message: "",
//     },
//   });
//   const { messages, setMessages, selectedConversation } = useConversation();
//   async function onSubmit(value: MessageInputType) {
//     if (!value.message.trim()) return;
//     try {
//       const response = await fetch(
//         `/api/messages/send/${selectedConversation?._id}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(value),
//         },
//       );
//       const data = await response.json();
//       if (data.error) throw new Error(data.error);
//       setMessages([...messages, data]);
//     } catch (err) {
//       if (err instanceof Error) {
//         toast.error(err.message);
//       } else {
//         toast.error("メッセージの送信に失敗しました！");
//       }
//     } finally {
//       form.reset();
//     }
//   }
//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="my-3 px-4">
//         <FormField
//           control={form.control}
//           name="message"
//           render={({ field }) => (
//             <FormItem className="relative w-full">
//               <FormControl>
//                 <Input
//                   placeholder="send a message"
//                   className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white"
//                   {...field}
//                 />
//               </FormControl>
//               <Button
//                 type="submit"
//                 variant={"ghost"}
//                 className="absolute inset-y-0 end-0 flex items-center px-3"
//               >
//                 {form.formState.isSubmitting ? (
//                   <Loader2 className="h-6 w-6 animate-spin text-white" />
//                 ) : (
//                   <BsSend />
//                 )}
//               </Button>
//             </FormItem>
//           )}
//         />
//         <FormMessage />
//       </form>
//     </Form>
//   );
// }

// export default MessageInput;
//-------------------------------------------------------------------------------------------

//------------------------------------Shadcn UI導入前のコード--------------------------------------
{
  /* <form className="my-3 px-4">
  <div className="relative w-full">
    <input
      type="text"
      className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white"
      placeholder="send a message"
    />
    <button
      type="submit"
      className="absolute inset-y-0 end-0 flex items-center px-3"
    >
      <BsSend />
    </button>
  </div>
</form> */
}
//-----------------------------------------------------------------------
