import React from "react";

function Message() {
  return (
    <div className="chat chat-end">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src={`https://img.daisyui.com/images/profile/demo/kenobee@192.webp`}
          />
        </div>
      </div>
      <div className={`chat-bubble bg-blue-500 text-white`}>こんにちは</div>
      <div className="chat-footer flex items-center gap-1 text-xs opacity-50">
        12:42
      </div>
    </div>
  );
}

export default Message;
