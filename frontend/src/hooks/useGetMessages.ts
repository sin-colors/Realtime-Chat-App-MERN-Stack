import type { MessageType } from "@/types";
import useConversation from "@/zustand/useConversation";
import { useQuery } from "@tanstack/react-query";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

function useGetMessages() {
  // const [loading, setLoading] = useState(false);
  const { selectedConversation } = useConversation();

  return useQuery({
    // IDが変わるたびに別のキャッシュとして管理される
    // IDごとに識別子が変わるため、IDごとにキャッシュの器が作成される
    // IDが１のときクエリーキーは["messages","1"]で、ID1とのメッセージのキャッシュが作成される
    // IDが２のときクエリーキーは["messages","2"]で、ID2とのメッセージのキャッシュが作成される
    // IDが３のときクエリーキーは["messages","3"]で、ID3とのメッセージのキャッシュが作成される
    queryKey: ["messages", selectedConversation?._id],
    queryFn: async () => {
      const response = await fetch(
        `/api/messages/${selectedConversation?._id}`,
      );
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      return data as MessageType[];
    },
    // selectedConversation._id がある時だけ実行する（重要！）
    enabled: !!selectedConversation?._id,
    // 常に最新を保つための設定（お好みで）
    refetchOnWindowFocus: false,
  });
}
export default useGetMessages;

//-----------------------------React Query導入前のコード----------------------------------
// function useGetMessages() {
//   const [loading, setLoading] = useState(false);
//   const { messages, setMessages, selectedConversation } = useConversation();
//   useEffect(() => {
//     async function getMessages() {
//       setLoading(true);
//       try {
//         const response = await fetch(
//           `/api/messages/${selectedConversation?._id}`,
//         );
//         const data = await response.json();
//         if (data.error) throw new Error(data.error);
//         setMessages(data);
//       } catch (err) {
//         if (err instanceof Error) {
//           toast.error(err.message);
//         } else {
//           toast.error("メッセージの取得に失敗しました！");
//         }
//       } finally {
//         setLoading(false);
//       }
//     }
//     if (selectedConversation?._id) {
//       getMessages();
//     }
//   }, [selectedConversation?._id, setMessages]);
//   return { loading, messages };
// }
// export default useGetMessages;
//-----------------------------------------------------------
