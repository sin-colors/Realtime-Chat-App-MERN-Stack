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
      required: function () {
        // images配列が[]である場合は、messageは必須とする
        // (images配列が[]で、messageが""である場合はエラーとなるようにする)
        return Array.isArray(this.images) && this.images.length === 0;
      },
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
        },
      ],
      default: [],
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

messageSchema.index({ createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;

//----------------------imagesフィールドを変更する前のコード----------------------------------
// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//   {
//     senderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     receiverId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     message: {
//       type: String,
//       required: function () {
//         // images配列が[]である場合は、messageは必須とする
//         // (images配列が[]で、messageが""である場合はエラーとなるようにする)
//         return Array.isArray(this.images) && this.images.length === 0;
//       },
//     },
//     images: {
//       type: [String],
//       required: true,
//     },
//     isRead: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },
//   },
//   { timestamps: true },
// );

// const Message = mongoose.model("Message", messageSchema);

// export default Message;
//-----------------------------------------------------------------------

// テキストのみや画像のみを送れるようにする
// 画像送信機能を追加するためmessageフィールドの必須指定を解除するか空文字を許容 → 空文字を許容
// フロントのバリデーションやバックエンドのコントローラーで両方とも空文字の場合を認めない処理を記述する
