import { useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  _id: string; // MongoDBのObjectIdはJSONでは文字列になる
  userName: string;
  gender: "male" | "female";
  profilePic: string;
  createdAt: string; // timestamps: true により生成。JSONではISO文字列
  updatedAt: string; // 同上
  // password は .select("-password") で除外されているため含まれない
}

function useGetConversations() {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<User[]>([]);
  useEffect(() => {
    async function getConversations() {
      setLoading(true);
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setConversations(data as User[]);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
          console.error(err.message);
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    }
    getConversations();
  }, []);
  return { loading, conversations };
}
export default useGetConversations;
