import { Request, Response } from "express";
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";
import { getReceiverSocketId, io } from "../socket/socket";
import cloudinary from "../config/cloudinary";
import z from "zod";

const sendMessageSchema = z
  .object({
    message: z.string(),
    images: z.array(z.string()).nullable(),
  })
  .refine(
    (data) => {
      const hasMessage = data.message.trim().length > 0;
      const hasImages = data.images !== null && data.images.length > 0;
      return hasMessage || hasImages;
    },
    {
      message: "テキストか画像のどちらかは必須です",
      path: ["message"],
    },
  );

export async function sendMessage(req: Request, res: Response) {
  // console.log("message sent!");
  try {
    // console.log(req.body);
    const validateBody = sendMessageSchema.parse(req.body);
    const { message, images } = validateBody;
    // console.log("message: ", message);
    // console.log("images: ", images);
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

    let imageUrls: string[] = [];

    //-------Promise.allを使ったコードに変更-----------
    // for (const image of images) {
    //   if (image) {
    //     const uploadResponse = await cloudinary.uploader.upload(image, {
    //       folder: process.env.CLOUDINARY_FOLDER,
    //     });
    //     imageUrls.push(uploadResponse.secure_url);
    //   }
    // }
    //------------------------------------------------

    if (images !== null) {
      const uploadPromises = images.map((image) =>
        cloudinary.uploader.upload(image, {
          folder: process.env.CLOUDINARY_FOLDER,
        }),
      );
      const uploadResults = await Promise.all(uploadPromises);
      // 2. アップロード後のURLを取得
      imageUrls = uploadResults.map((result) => result.secure_url);
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      images: imageUrls,
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

//---------------------------imagesフィールドを追加する前のコード---------------------------------------

// export async function sendMessage(req: Request, res: Response) {
//   console.log("message sent!");
//   try {
//     // console.log(req.body);
//     const { message } = req.body;
//     // console.log("message: ", message);
//     const { receiverId } = req.params;
//     // console.log("receiverId: ", receiverId);
//     if (!req.user) {
//       return res.status(401).json({ error: "ユーザーが認証されていません" });
//     }
//     const senderId = req.user._id;
//     // console.log("req.user", req.user);
//     // console.log("senderId: ", senderId);
//     let conversation = await Conversation.findOne({
//       participants: { $all: [senderId, receiverId] },
//     });
//     if (!conversation) {
//       conversation = await Conversation.create({
//         participants: [senderId, receiverId],
//       });
//     }
//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       message,
//     });
//     if (newMessage) {
//       conversation.messages.push(newMessage._id);
//     }
//     await Promise.all([conversation.save(), newMessage.save()]);
//     if (typeof receiverId === "string") {
//       const receiverSocketId = getReceiverSocketId(receiverId);
//       if (receiverSocketId) {
//         io.to(receiverSocketId).emit("newMessage", newMessage);
//       }
//     }
//     res.status(201).json(newMessage);
//   } catch (err) {
//     if (err instanceof Error) {
//       console.log("sendMessage controllerでエラーが発生しました", err.message);
//     } else {
//       console.log("sendMessage controllerでエラーが発生しました", err);
//     }
//     res
//       .status(500)
//       .json({ error: "メッセージ送信中にサーバー内部でエラーが発生しました" });
//   }
// }
//------------------------------------------------------------------------------------

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

export async function markAsRead(req: Request, res: Response) {
  try {
    // チャット相手のID
    const { conversationId } = req.params;
    // 自分のID
    const userId = req.user?._id;
    // 相手から自分に送られた未読メッセージをすべて既読にする
    const result = await Message.updateMany(
      {
        senderId: conversationId,
        receiverId: userId,
        isRead: false,
      },
      {
        $set: { isRead: true },
      },
    );
    // 相手がオンラインであれば、Socket.io で「既読になったよ」と通知する
    if (typeof conversationId === "string") {
      const receiverSocketId = getReceiverSocketId(conversationId);
      if (receiverSocketId) {
        // 相手側に対して「自分（userId）との会話が既読になった」ことを伝える
        io.to(receiverSocketId).emit("messagesRead", {
          conversationId: userId, // 相手から見た「既読にされた会話のID」は、自分のID
        });
      }
    }
    res.status(200).json({
      message: "既読に更新されました",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log("markAsRead controllerでエラーが発生しました", err.message);
    } else {
      console.log("markAsRead controllerでエラーが発生しました", err);
    }
    res.status(500).json({ error: "既読更新中にエラーが発生しました" });
  }
}
