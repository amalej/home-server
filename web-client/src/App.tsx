import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import ShowsPage from "./pages/Shows/ShowsPage";
import UploadPage from "./pages/Upload/UploadPage";
import NavOverlay from "./components/NavOverlay/NavOverlay";
import ShowDetails from "./pages/Shows/ShowDetails/ShowDetails";
import IssuesPage from "./pages/Issues/IssuesPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavOverlay child={<HomePage />} />,
  },
  {
    path: "/home",
    element: <NavOverlay child={<HomePage />} />,
  },
  {
    path: "/shows",
    element: <NavOverlay child={<ShowsPage />} />,
  },
  {
    path: "/shows/*",
    element: <NavOverlay child={<ShowDetails />} />,
  },
  {
    path: "/upload",
    element: <NavOverlay child={<UploadPage />} />,
  },
  {
    path: "/issues",
    element: <NavOverlay child={<IssuesPage />} />,
  },
  {
    path: "/about",
    element: <NavOverlay child={<div>About</div>} />,
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
