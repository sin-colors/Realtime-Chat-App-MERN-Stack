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

function MessageInput() {
  const form = useForm<MessageInputType>({
    resolver: zodResolver(messageInputSchema),
    defaultValues: {
      message: "",
      image: null,
    },
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const files = form.watch("image");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { selectedConversation } = useConversation();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (value: MessageInputType) => {
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
      form.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
      setImageUrls([]);
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("メッセージの送信に失敗しました！");
      }
    },
  });
  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);
  async function onSubmit(value: MessageInputType) {
    if (!value.message.trim() && !value.image) return;
    mutate(value);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange, onBlur, name, ref, disabled } }) => (
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
                        const currentFiles = form.getValues("image") || [];
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
