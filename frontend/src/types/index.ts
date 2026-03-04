export interface User {
  _id: string; // MongoDBのObjectIdはJSONでは文字列になる
  userName: string;
  gender: "male" | "female";
  profilePic: string;
  createdAt: string; // timestamps: true により生成。JSONではISO文字列
  updatedAt: string; // 同上
  // password は .select("-password") で除外されているため含まれない
}

export interface MessageType {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}
