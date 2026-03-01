import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IoSearchSharp } from "react-icons/io5";
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
import useConversation from "@/zustand/useConversation";
import useGetConversations from "@/hooks/useGetConversations";
import { toast } from "sonner";
const searchInputSchema = z.object({
  search: z.string().min(3, { message: "検索は３文字以上でお願いします" }),
});
type SearchInputType = z.infer<typeof searchInputSchema>;
function SearchInput() {
  const form = useForm<SearchInputType>({
    resolver: zodResolver(searchInputSchema),
    defaultValues: {
      search: "",
    },
  });
  const { setSelectedConversation } = useConversation();
  const { conversations } = useGetConversations();
  function onSubmit(value: SearchInputType) {
    console.log("seachValue: ", value);
    if (!value.search.trim()) return;
    if (value.search.length < 3) {
      return toast.error("検索は３文字以上でお願いします");
    }
    const conversation = conversations.find((c) =>
      c.userName.toLowerCase().includes(value.search.toLowerCase()),
    );
    if (conversation) {
      setSelectedConversation(conversation);
      form.reset();
    } else {
      toast.error("ユーザーが見つかりませんでした");
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center gap-2"
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Search..."
                  className="input focus:outline-base-content/20 rounded-full border border-gray-600 bg-gray-700/50 px-3 text-white placeholder-gray-400 transition-all focus:outline-2 focus:outline-offset-2"
                  {...field}
                />
              </FormControl>
              <Button
                type="submit"
                className="btn btn-circle bg-sky-500 text-white"
              >
                <IoSearchSharp />
              </Button>
            </FormItem>
          )}
        />
        <FormMessage />
      </form>
    </Form>
  );
}

export default SearchInput;

{
  /* <input
  type="text"
  placeholder="Search..."
  className="input focus:outline-base-content/20 rounded-full border border-gray-600 bg-gray-700/50 px-3 text-white placeholder-gray-400 transition-all focus:outline-2 focus:outline-offset-2"
/>
<button type="submit" className="btn btn-circle bg-sky-500 text-white">
  <IoSearchSharp />
</button> */
}
