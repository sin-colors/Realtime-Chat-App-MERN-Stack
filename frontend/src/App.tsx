import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Signup from "./pages/signup/Signup";
import { Toaster } from "sonner";
import { useAuthContext } from "./context/AuthContext";
import Settings from "./pages/settings/Settings";

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
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
