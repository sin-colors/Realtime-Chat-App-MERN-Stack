import { Request, Response } from "express";
import User from "../models/user.model";

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
    res
      .status(500)
      .json({
        error:
          "getUsersForSidebar関数実行中に、サーバー内部でエラーが発生しました",
      });
  }
}
