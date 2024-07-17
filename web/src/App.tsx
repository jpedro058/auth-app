import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Auth from "./routes/auth/Auth";
import Home from "./routes/home/Home";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { currentUser } = useContext(AuthContext) as { currentUser: string };
  return !currentUser ? <Navigate to="/auth" /> : children;
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/home",
      element: (
        <RequireAuth>
          <Home contentType="allTasks" />
        </RequireAuth>
      ),
    },
    {
      path: "/",
      element: <Navigate to="/home" />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
