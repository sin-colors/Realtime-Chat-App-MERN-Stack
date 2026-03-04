import type { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

// エラーが発生したときのトースト表示をまだ実装してない！！

function useGetConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      return data as User[];
    },
  });
}
export default useGetConversations;

//-------------------------React Query導入前のコード----------------------------
// function useGetConversations() {
//   const [loading, setLoading] = useState(false);
//   const [conversations, setConversations] = useState<User[]>([]);
//   useEffect(() => {
//     async function getConversations() {
//       setLoading(true);
//       try {
//         const response = await fetch("/api/users");
//         const data = await response.json();
//         if (data.error) throw new Error(data.error);
//         setConversations(data as User[]);
//       } catch (err) {
//         if (err instanceof Error) {
//           toast.error(err.message);
//           console.error(err.message);
//         } else {
//           console.error(err);
//         }
//       } finally {
//         setLoading(false);
//       }
//     }
//     getConversations();
//   }, []);
//   return { loading, conversations };
// }
// export default useGetConversations;
//--------------------------------------------------------------------

//------------------------zustandに記述する場合-------------------------
// getUsers: async () => {
//   set({ loading: true });
//   try {
//     const response = await fetch("/api/users");
//     const data = await response.json();

//     if (!response.ok) {
//       // サーバーが返したエラーメッセージを使って例外を投げる
//       throw new Error(data.error || "エラーが発生しました");
//     }

//     // 成功時のみ state を更新
//     set({ users: data as User[] });
//   } catch (err: any) {
//     // ここでトーストを表示したり、エラー状態を保持したりする
//     toast.error(err.message);
//   } finally {
//     set({ loading: false });
//   }
// }
//--------------------------------------------------------
