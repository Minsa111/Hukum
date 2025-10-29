import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { Toaster } from "sonner";
import { ProtectedAdminRoute, ProtectedLoginRoute } from "./routes/protectedroute";

import PublicDashboard from "./views/public/public-dashboard";
import LoginPage from "./views/user/login";
import Dashboard from "./views/user/dashboard";
import ShopReport from "./views/user/shopreport";
import ShopActivity from "./views/user/reportactivity";
import NotFoundPage from "./views/notfound";
import { AdminLayout } from "./views/layout/adminLayout";

const App: React.FC = () => {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<Navigate to="/public-dashboard" replace />} />
        <Route path="/public-dashboard" element={<PublicDashboard />} />

        {/* Auth */}
        <Route
          path="/auth/login"
          element={
            <ProtectedLoginRoute>
              <LoginPage />
            </ProtectedLoginRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
            <Route index element={<Dashboard />} />
            <Route path="pembelanjaan" element={
              <ProtectedAdminRoute>
                <ShopReport />
              </ProtectedAdminRoute>
            } />
            <Route path="pembelanjaan/:purchase_report_id" element={
              <ProtectedAdminRoute>
                <ShopActivity />
              </ProtectedAdminRoute>
            } />
        </Route>

        <Route path="*" element=
        {
            <NotFoundPage />
        } />
      </Routes>
    </Router>
  );
};

export default App;
