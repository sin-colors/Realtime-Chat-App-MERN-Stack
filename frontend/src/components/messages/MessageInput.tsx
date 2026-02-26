import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BsSend } from "react-icons/bs";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const messageInputSchema = z.object({
  message: z
    .string()
    .min(1, { message: "メッセージを入力してから送信してください" }),
});
type MessageInputType = z.infer<typeof messageInputSchema>;

function MessageInput() {
  const form = useForm<MessageInputType>({
    resolver: zodResolver(messageInputSchema),
    defaultValues: {
      message: "",
    },
  });
  function onSubmit() {}
  return (
    <Form {...form}>
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
                <BsSend />
              </Button>
            </FormItem>
          )}
        />
        <FormMessage />
      </form>
    </Form>
  );
}

export default MessageInput;

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
