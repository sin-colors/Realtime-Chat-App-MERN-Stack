import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuthContext } from "./AuthContext";
import io, { Socket } from "socket.io-client";
import type { User } from "@/zustand/useConversation";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: User[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error(
      "useSocketContextはSocketContextProviderの内側で使ってください",
    );
  return context;
}

export function SocketContextProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const { authUser } = useAuthContext();
  useEffect(() => {
    if (authUser) {
      const newSocket = io("http://localhost:5000");
      setSocket(newSocket);
      return () => {
        newSocket.close();
        setSocket(null);
      };
    } else {
      // if (socket) {
      //   socket.close();
      //   setSocket(null);
      // }
      setSocket(null);
    }
  }, [authUser]);
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}

// 補足：Socket.io 接続時の注意
// 通常、Socket.io でオンラインユーザー管理などを行う場合、サーバー側が「誰が接続したか」を知る必要があります。
// 上記コードの修正例に含めましたが、io() の第2引数で query: { userId: authUser._id } のように情報を渡すのが一般的です。これにより、サーバー側の io.on("connection", (socket) => { ... }) 内で socket.handshake.query.userId として取得できるようになります。
