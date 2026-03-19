import cron from "node-cron";
import { v2 as cloudinary } from "cloudinary";
import Message from "../models/message.model";

function setupCron() {
  cron.schedule("0 0 * * *", async () => {
    console.log("古いメッセージと画像のクリーンアップを開始します...");
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      // 1. 削除対象のメッセージを取得（画像があるもの）
      const expiredMessages = await Message.find({
        createdAt: { $lt: sixMonthsAgo },
      });
      if (expiredMessages.length === 0) {
        console.log("削除対象のメッセージはありませんでした");
        return;
      }

      // 2. Cloudinaryから画像を削除
      const publicIds = expiredMessages.flatMap((msg) =>
        msg.images.map((image) => image.publicId),
      );
      if (publicIds.length > 0) {
        // まとめて削除（一度に100個までなどの制限があるため、大量にある場合は分割が必要）
        await cloudinary.api.delete_resources(publicIds);
        console.log(
          `${publicIds.length} 件の画像をCloudinaryから削除しました。`,
        );
      }

      // 3. DBからメッセージを一括削除
      const result = await Message.deleteMany({
        _id: { $in: expiredMessages.map((msg) => msg._id) },
      });
      console.log(`${result.deletedCount}件のメッセージをDBから削除しました`);
    } catch (err) {
      console.error("クリーンアップ中にエラーが発生しました:", err);
    }
  });
}

export default setupCron;
