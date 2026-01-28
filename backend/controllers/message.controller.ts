import { Request, Response } from "express";
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";

export async function sendMessage(req: Request, res: Response) {
  console.log("message sent!");
  try {
    // console.log(req.body);
    const { message } = req.body;
    // console.log("message: ", message);
    const { id: receiverId } = req.params;
    // console.log("receiverId: ", receiverId);
    if (!req.user) {
      return res.status(401).json({ error: "ユーザーが認証されていません" });
    }
    const senderId = req.user._id;
    // console.log("senderId: ", senderId);
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
    if (newMessage) {
      conversation.messages.push(newMessage._id);
      // 後でここにsocket.ioを代入する
    }
    await Promise.all([conversation.save(), newMessage.save()]);
    res.status(201).json(newMessage);
  } catch (err) {
    if (err instanceof Error) {
      console.log("sendMessage controllerでエラーが発生しました", err.message);
    } else {
      console.log("sendMessage controllerでエラーが発生しました", err);
    }
    res
      .status(500)
      .json({ error: "メッセージ送信中にサーバー内部でエラーが発生しました" });
  }
}
