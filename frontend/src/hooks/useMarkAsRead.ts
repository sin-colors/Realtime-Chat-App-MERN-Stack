import type { MessageType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const response = await fetch(`/api/messages/read/${conversationId}`, {
        method: "PUT",
      });
      return response.json();
    },
    onSuccess: (_, conversationId) => {
      queryClient.setQueryData<MessageType[]>(
        ["messages", conversationId],
        (oldMessages) =>
          oldMessages?.map((message) => ({ ...message, isRead: true })),
      );
    },
  });
}

export { useMarkAsRead };
