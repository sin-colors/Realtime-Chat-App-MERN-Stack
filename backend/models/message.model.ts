import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", messageSchema);

export default Message;

// テキストのみや画像のみを送れるようにする
// 画像送信機能を追加するためmessageフィールドの必須指定を解除するか空文字を許容 → 空文字を許容
// フロントのバリデーションやバックエンドのコントローラーで両方とも空文字の場合を認めない処理を記述する
