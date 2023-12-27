import { useEffect } from "react";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import ShowsPage from "./pages/Shows/ShowsPage";
import UploadPage from "./pages/Upload/UploadPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/shows/*",
    element: <ShowsPage />,
  },
  {
    path: "/upload",
    element: <UploadPage />,
  },
  {
    path: "/about",
    element: <div>About</div>,
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
