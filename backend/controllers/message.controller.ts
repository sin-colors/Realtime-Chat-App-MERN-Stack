import { Request, Response } from "express";
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";
import { getReceiverSocketId, io } from "../socket/socket";

export async function sendMessage(req: Request, res: Response) {
  console.log("message sent!");
  try {
    // console.log(req.body);
    const { message } = req.body;
    // console.log("message: ", message);
    const { receiverId } = req.params;
    // console.log("receiverId: ", receiverId);
    if (!req.user) {
      return res.status(401).json({ error: "ユーザーが認証されていません" });
    }
    const senderId = req.user._id;
    // console.log("req.user", req.user);
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
    }
    await Promise.all([conversation.save(), newMessage.save()]);
    if (typeof receiverId === "string") {
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
    }
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

export async function getMessages(req: Request, res: Response) {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user?._id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");
    if (!conversation) {
      return res.status(200).json([]);
    }
    const messages = conversation.messages;
    res.status(200).json(messages);
  } catch (err) {
    if (err instanceof Error) {
      console.log("getMessage controllerでエラーが発生しました", err.message);
    } else {
      console.log("getMessage controllerでエラーが発生しました", err);
    }
    res.status(500).json({
      error: "メッセージ取得中に、サーバー内部でエラーが発生しました",
    });
  }
}
