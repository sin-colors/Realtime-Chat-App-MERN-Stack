import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller";
import protectRoute from "../middleware/protectRoute";

const router = express.Router();

// 現在ログインしているユーザー(自分)と:idで指定したユーザーとのメッセージを取得する
router.get("/:id", protectRoute, getMessages);
// :idは送信先のユーザーのid(_id)
router.post("/send/:id", protectRoute, sendMessage);

export default router;
