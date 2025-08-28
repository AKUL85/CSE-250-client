import {
  createBrowserRouter,
  Navigate,
 
} from "react-router-dom";
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



 export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
    
        <AppShell />
      
    ),
    children:[
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      {path:'profile',element:<ProfilePage2></ProfilePage2>},
       { path:"food/menu", element:<FoodMenuPage></FoodMenuPage>},
      { path:"food/orders" , element:<FoodOrdersPage />},
      {path:'/seat/apply',element:<SeatApplicationPage></SeatApplicationPage>},
      {path:'/complaints',element:<ComplainPage></ComplainPage>},
      {path:'/complaints/:id',element:<ComplaintDetailsPage></ComplaintDetailsPage>},
      {path:'/laundry',element:<LaundryPage></LaundryPage>},
      {path:"/rooms",element:<RoomsPage></RoomsPage>},
      {path:'/admin/users',element:<AdminUsersPage></AdminUsersPage>},
      {path:'/admin/rooms',element:<AdminRoomsPage></AdminRoomsPage>}

    ]
  }
]);