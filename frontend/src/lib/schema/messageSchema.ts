import z from "zod";

const ACCEPTED_IMAGE_EXTENSIONS = ["jpg", "png", "jpeg"];
const MAX_IMAGE_FILE_SIZE = 1024 * 1024 * 15; //15MB

export const messageInputSchema = z
  .object({
    message: z.string(),
    images: z
      .array(
        z.instanceof(File).refine(
          (file) => {
            const fileName = file.name.toLowerCase();
            return ACCEPTED_IMAGE_EXTENSIONS.some((ext) =>
              fileName.endsWith(ext),
            );
          },
          {
            message: `サポートされているファイル形式は${ACCEPTED_IMAGE_EXTENSIONS.join(",")}です`,
          },
        ),
      )
      .nullable()
      .refine(
        (files) => {
          if (files === null) return true;
          const totalFileSize = files.reduce(
            (total, file) => total + file.size,
            0,
          );
          return totalFileSize <= MAX_IMAGE_FILE_SIZE;
        },
        {
          message: "15MB以下になるようにファイルを選択してください",
        },
      ),
  })
  .refine((data) => data.message.trim() !== null || data.images !== null, {
    message: "テキストか画像のどちらかは必須です",
    path: ["message"],
  });
export type MessageInputType = z.infer<typeof messageInputSchema>;
