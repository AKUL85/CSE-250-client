import { createBrowserRouter, Navigate } from "react-router-dom";
import AppShell from "../layout/AppShell";
import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import FoodOrdersPage from "../pages/food/FoodOredersPage";
import ProfilePage2 from "../pages/Profile/ProfilePage2";
import FoodMenuPage from "../pages/food/FoodMenuPage";
import SeatApplicationPage from "../pages/seat/SeatApplicationPage";
import ComplainPage from "../pages/complains/ComplainPage";
import ComplaintDetailsPage from "../pages/complains/ComplaintDetailsPage";
import LaundryPage from "../pages/LaundryPage";
import RoomsPage from "../pages/roomPage/RoomsPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminRoomsPage from "../pages/admin/AdminRoomsPage";
import ProtectedRoute from "../pages/auth/ProtectedRoute";
import RegisterStudentPage from "../components/ForAdmin/StudentsReg/RegisterStudentPage";
import ComplainForm from "../pages/complains/ComplainForm";
import MannageFood from "../pages/food/ManageFood";
import SeatApplications from "../pages/admin/SeatApplications";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        {" "}
        {/* ✅ Protect everything inside AppShell */}
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "profile", element: <ProfilePage2 /> },
      { path: "food/menu", element: <FoodMenuPage /> },
      { path: "food/orders", element: <FoodOrdersPage /> },
      { path: "seat/apply", element: <SeatApplicationPage /> },
      { path: "complaints", element: <ComplainPage /> },
      { path: "complaints/:_id", element: <ComplaintDetailsPage /> },
      { path: "laundry", element: <LaundryPage /> },
      { path: "rooms", element: <RoomsPage /> },
      { path: "admin/users", element: <AdminUsersPage /> },
      { path: "admin/rooms", element: <AdminRoomsPage /> },
      {
        path: "/admin/register-student",
        element: <RegisterStudentPage />,
      },
      {
        path: "/complain-form",
        element: <ComplainForm></ComplainForm>,
      },
      {
        path: "/admin/menus",
        element: <MannageFood />,
      },
      {
        path: "/admin/seat-applications",
        element: <SeatApplications />
      }
    ],
  },
]);
