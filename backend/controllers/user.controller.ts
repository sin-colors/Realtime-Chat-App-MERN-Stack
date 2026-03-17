import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";

export async function getUsersForSidebar(req: Request, res: Response) {
  try {
    const loggedInUserId = req.user?._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (err) {
    if (err instanceof Error) {
      console.error(
        "getUsersForSidebar関数でエラーが発生しました",
        err.message,
      );
    } else {
      console.error("getUsersForSidebar関数でエラーが発生しました", err);
    }
    res.status(500).json({
      error:
        "getUsersForSidebar関数実行中に、サーバー内部でエラーが発生しました",
    });
  }
}

export async function changeUserName(req: Request, res: Response) {
  const { newUserName, password } = req.body;
  if (!req.user) return res.status(400).json({ error: "ログインしてください" });
  // データベースからユーザーを取得
  const user = await User.findById(req.user._id);
  if (user === null)
    return res.status(400).json({ error: "ユーザーが見つかりませんでした" });
  // パスワードの照合
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect)
    return res.status(400).json({ error: "パスワードが正しくありません" });
  // 新しいユーザー名がすでに使われていないか確認
  const existingUser = await User.findOne({ userName: newUserName });
  if (existingUser)
    return res
      .status(400)
      .json({ error: "このユーザー名はすでに使われています" });
  // データベースの更新
  user.userName = newUserName;
  await user.save();

  return res.status(201).json({ message: "ユーザー名を更新しました" });
}

export function getMe(req: Request, res: Response) {
  try {
    if (!req.user)
      return res.status(401).json({ error: "ログインしていません" });
    return res.status(200).json(req.user);
  } catch (err) {
    console.error("getMe関数でエラーが発生しました", err);
    return res.status(500).json({ error: "サーバー内部エラー" });
  }
}
