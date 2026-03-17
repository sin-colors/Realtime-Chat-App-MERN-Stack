import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Signup from "./pages/signup/Signup";
import { Toaster } from "sonner";
import { useAuthContext } from "./context/AuthContext";
import Settings from "./pages/settings/Settings";
import ChangeUserNameForm from "./pages/settings/ChangeUserNameForm";

function App() {
  const { authUser } = useAuthContext();
  return (
    <>
      <div className="flex h-screen w-full items-center justify-center md:p-4">
        <Toaster position="top-center" richColors closeButton />
        <Routes>
          <Route
            path="/"
            element={authUser ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={authUser ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={authUser ? <Navigate to="/" /> : <Signup />}
          />
          <Route
            path="/settings"
            element={authUser ? <Settings /> : <Navigate to="/login" />}
          >
            <Route path="username" element={<ChangeUserNameForm />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;

// パス(Routeコンポーネント)をネストする場合、子のパスは相対パスを指定する。(先頭に/を付けない！先頭の/はルートを表現している)
// path="/username"とすると、ルート(ホスト名) ＋ /username と解釈される
// ↑ Routeコンポーネントのネストとパス名がかみ合わないので、エラーが出る可能性がある
// path="username"とすると、ルート(ホスト名) ＋ /settings(親のパス)＋ / ＋username(子のパス) と解釈される
