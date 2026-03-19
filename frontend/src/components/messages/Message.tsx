import { useAuthContext } from "@/context/AuthContext";
import type { MessageType } from "@/types";
import { extractTime } from "@/utils/extractTime";
import useConversation from "@/zustand/useConversation";

function Message({ message }: { message: MessageType }) {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const fromMe = message.senderId === authUser?._id;
  // console.log("message.senderId: ", message.senderId);
  // console.log("authUser?._id: ", authUser?._id);
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  // 後で修正する必要がある！ selectedConversationはグループチャットの可能性もある
  const profilePic = fromMe
    ? authUser.profilePic
    : selectedConversation?.profilePic;
  const bubbleBgColor = fromMe ? "bg-lime-200" : "bg-rose-200";
  const formattedTime = extractTime(message.createdAt);
  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            // src={`https://img.daisyui.com/images/profile/demo/kenobee@192.webp`}
            src={profilePic}
          />
        </div>
      </div>
      <div
        className={`chat-bubble text-zinc-900 ${bubbleBgColor} flex flex-col gap-2 pb-2`}
      >
        {message.images &&
          message.images.length > 0 &&
          message.images.map((image) => (
            <img
              key={image.publicId}
              src={image.url}
              alt="送信した画像"
              className="max-w-62.5 cursor-pointer rounded-lg hover:opacity-90"
              onClick={() => window.open(image.url, "_blank")}
            />
          ))}
        {message.message && <p>{message.message}</p>}
      </div>
      <div className="chat-footer flex items-center gap-1 text-xs opacity-50">
        {formattedTime}
        {fromMe &&
          (message.isRead ? (
            <span className="ml-1">既読</span>
          ) : (
            <span className="ml-1">未読</span>
          ))}
      </div>
    </div>
  );
}

export default Message;

//--------------------imagesフィールドを追加する前のコード------------------
// function Message({ message }: { message: MessageType }) {
//   const { authUser } = useAuthContext();
//   const { selectedConversation } = useConversation();
//   const fromMe = message.senderId === authUser?._id;
//   // console.log("message.senderId: ", message.senderId);
//   // console.log("authUser?._id: ", authUser?._id);
//   const chatClassName = fromMe ? "chat-end" : "chat-start";
//   // 後で修正する必要がある！ selectedConversationはグループチャットの可能性もある
//   const profilePic = fromMe
//     ? authUser.profilePic
//     : selectedConversation?.profilePic;
//   const bubbleBgColor = fromMe ? "bg-lime-200" : "bg-rose-200";
//   const formattedTime = extractTime(message.createdAt);
//   return (
//     <div className={`chat ${chatClassName}`}>
//       <div className="chat-image avatar">
//         <div className="w-10 rounded-full">
//           <img
//             alt="Tailwind CSS chat bubble component"
//             // src={`https://img.daisyui.com/images/profile/demo/kenobee@192.webp`}
//             src={profilePic}
//           />
//         </div>
//       </div>
//       <div className={`chat-bubble text-zinc-900 ${bubbleBgColor} pb-2`}>
//         {message.message}
//       </div>
//       <div className="chat-footer flex items-center gap-1 text-xs opacity-50">
//         {formattedTime}
//         {fromMe &&
//           (message.isRead ? (
//             <span className="ml-1">既読</span>
//           ) : (
//             <span className="ml-1">未読</span>
//           ))}
//       </div>
//     </div>
//   );
// }
