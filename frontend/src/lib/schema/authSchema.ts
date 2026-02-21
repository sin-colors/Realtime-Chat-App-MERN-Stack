import * as z from "zod";

export const registerSchema = z
  .object({
    userName: z.string().min(2, {
      message: "ユーザー名は2文字以上で入力してください。",
    }),
    password: z.string().min(6, {
      message: "パスワードは6文字以上で入力してください。",
    }),
    confirmPassword: z.string().min(6, {
      message: "パスワードは6文字以上で入力してください。",
    }),
    // manCheckbox: z.boolean(),
    // womanCheckbox: z.boolean(),
    gender: z.enum(["male", "female"], {
      message: "性別を選択してください。",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません。",
    path: ["confirmPassword"],
  });

export type RegisterType = z.infer<typeof registerSchema>;
