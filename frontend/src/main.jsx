import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import store from "./store/store.js";
import App from "./App.jsx";
import "./index.css";
import Authlayout from "./Pages/Authlayout.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import { checkAuth, fetchUser } from "./store/auth-slice/index.js";
import CheckAuth from "./Compontes/CheckAuth.jsx";
import { NotFoundPage } from "./Compontes/NotFoundPage.jsx";
import UnauthPage from "./Compontes/UnauthPage.jsx";
import { Toaster } from "react-hot-toast";
import { Loader, Loader2 } from "lucide-react";
import Spinner from "./Compontes/Spinner/Spinner.jsx";
import ManagerDashboard from "./Pages/Manager/Dashboard.jsx";
import Adminlayout from "./Pages/Admin/Adminlayout.jsx";
import EngineerDashboard from "./Pages/Engineer/Dashboard.jsx";
import CreateAssignmentForm from "./Pages/Engineer/CreateAssignments.jsx";
import ProjectListPage from "./Pages/Project/ProjectListPage.jsx";
import CreateProjectForm from "./Pages/Project/CreateProject.jsx";
import EditProjectForm from "./Pages/Project/EditProjectForm.jsx";
import EngineerProfile from "./Pages/Engineer/EngineerProfile.jsx";
import EngineerList from "./Pages/Engineer/EngineerList.jsx";
import ManagerProfile from "./Pages/Manager/ManagerProfile.jsx";
import AssignmentListPage from "./Pages/Engineer/AssignmentList.jsx";
import LoaderTab from "./Ui/LoaderTab.jsx";

const RoutesWithAuth = () => {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  // console.log(isAuthenticated, user, "gg");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token && !isAuthenticated) {
      dispatch(checkAuth(token));
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    // Make sure user is fetched if not available
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);
  if (isLoading)
    return (
      <div className="flex items-center bg-black justify-center h-screen">
        {/* <Loader className="size-10 animate-spin"></Loader> */}
        <LoaderTab />
      </div>
    );
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <CheckAuth>
          <App />
        </CheckAuth>
      ),
    },
    {
      path: "auth",
      element: (
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <Authlayout />
        </CheckAuth>
      ),
      children: [
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
      ],
    },
    {
      path: "",
      element: (
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <Adminlayout />
        </CheckAuth>
      ),
      children: [
        { path: "manager-dashboard", element: <ManagerDashboard /> },
        { path: "manager-profile", element: <ManagerProfile /> },
        { path: "engineer-dashboard", element: <EngineerDashboard /> },
        { path: "engineers", element: <EngineerList /> },
        { path: "engineers/:id", element: <EngineerProfile /> },
        { path: "assignments/new", element: <CreateAssignmentForm /> },
        { path: "projects", element: <ProjectListPage /> },
        { path: "projects/new", element: <CreateProjectForm /> },
        { path: "/projects/edit/:id", element: <EditProjectForm /> },
        { path: "assignments", element: <AssignmentListPage /> },
      ],
    },

    // Not found page
    { path: "/unauth-page", element: <UnauthPage /> },
    { path: "*", element: <NotFoundPage /> },
  ]);
  return <RouterProvider router={router} />;
};

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Toaster />
    <RoutesWithAuth />
  </Provider>
);
