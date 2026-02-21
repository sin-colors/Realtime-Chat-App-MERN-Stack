import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

interface AuthUser {
  _id: string;
  userName: string;
  profilePic: string;
}

interface AuthContextType {
  authUser: AuthUser | null;
  setAuthUser: Dispatch<SetStateAction<AuthUser | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem("chat-user");
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error(
        "localStorageから取得した認証ユーザーの解析に失敗しました: ",
        err,
      );
      return null;
    }
  });
  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error(
      "useAuthContext は AuthContextProvider 内で使用する必要があります",
    );
  return context;
}
