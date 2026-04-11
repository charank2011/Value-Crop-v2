import { createBrowserRouter, Navigate } from "react-router";
import { Login } from "./components/Login";
import { DashboardLayout } from "./components/DashboardLayout";
import { AdminLayout } from "./components/AdminLayout";
import { BuyerLayout } from "./components/BuyerLayout";
import { DashboardHome } from "./components/DashboardHome";
import { ProductsList } from "./components/ProductsList";
import { ProductForm } from "./components/ProductForm";
import { InventoryManagement } from "./components/InventoryManagement";
import { Settings } from "./components/Settings";
import { AdminDashboard } from "./components/AdminDashboard";
import { BuyerDashboard } from "./components/BuyerDashboard";
import { NotFound } from "./components/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", Component: AdminDashboard },
      { path: "users", Component: AdminDashboard },
      { path: "products", Component: AdminDashboard },
    ],
  },
  {
    path: "/farmer",
    element: <ProtectedRoute allowedRoles={['farmer']}><DashboardLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/farmer/dashboard" replace /> },
      { path: "dashboard", Component: DashboardHome },
      { path: "products", Component: ProductsList },
      { path: "products/new", Component: ProductForm },
      { path: "products/edit/:id", Component: ProductForm },
      { path: "inventory", Component: InventoryManagement },
      { path: "settings", Component: Settings },
    ],
  },
  {
    path: "/buyer",
    element: <ProtectedRoute allowedRoles={['buyer']}><BuyerLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/buyer/dashboard" replace /> },
      { path: "dashboard", Component: BuyerDashboard },
      { path: "favorites", Component: BuyerDashboard },
      { path: "profile", Component: BuyerDashboard },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
