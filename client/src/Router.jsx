import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";

const Router = () => {
  const url =
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV == "development" ? "http://localhost:3000" : "";

  const router = createBrowserRouter([
    { path: "/", element: <Home url={url} /> },
    { path: "/chat", element: <Chat url={url} /> },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
