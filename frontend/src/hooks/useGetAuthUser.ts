import { useQuery } from "@tanstack/react-query";

export function useGetAuthUser() {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/users/me");
        // 未ログイン時はエラーを投げずnullを返すと扱いやすい
        // statusコードはバックエンドのコントローラーで定義しているもｎ
        if (response.status === 401) return null;
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "ユーザー情報の取得に失敗しました",
          );
        }
        return await response.json();
      } catch (err) {
        console.error("useGetAuthUser内でのエラー: ", err);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5分間はキャッシュを新鮮とみなす
  });
}
