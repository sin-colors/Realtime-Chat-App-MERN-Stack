import z from "zod";

export const messageInputSchema = z
  .object({
    message: z.string(),
    image: z.string(),
  })
  .refine(
    (data) => data.message.trim().length > 0 || data.image.trim().length > 0,
    {
      message: "メッセージか画像のどちらかは必須です",
      path: ["message"],
    },
  );
export type MessageInputType = z.infer<typeof messageInputSchema>;
