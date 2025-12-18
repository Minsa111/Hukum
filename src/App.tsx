import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import "./App.css";
import { Toaster } from "sonner";
import { ProtectedAdminRoute, ProtectedLoginRoute, ProtectedSuperAdminRoute } from "./routes/protectedroute";
import PublicDashboard from "./views/public/public-dashboard";
import Recap from "./views/public/rekap";
import SchoolRecap from "./views/public/rekap-school";
import AdminSchool from "./views/superadmin/school";
import AdminSchoolDetail from "./views/superadmin/school-detail";
import ReportRecap from "./views/public/public-report-activity";
import LoginPage from "./views/user/login";
import Dashboard from "./views/user/dashboard";
import AdminDashboard from "./views/superadmin/dashboard";
import ShopReport from "./views/user/shopreport";
import AccountsPage from "./views/superadmin/account";
import AccountDetailPage from "./views/superadmin/account-detail";
import AdminShopReport from "./views/superadmin/shopreport";
import ShopActivity from "./views/user/reportactivity";
import AdminShopActivity from "./views/superadmin/reportactivity";
import NotFoundPage from "./views/notfound";
import { AdminLayout } from "./views/layout/adminLayout";
import { NavLayout } from "./views/layout/defLayout";

const App: React.FC = () => {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<NavLayout />} >
          <Route index element={<PublicDashboard /> } />
          <Route path="rekap" element={<Recap />} />
          <Route path="rekap/:nisn" element={<SchoolRecap />} />
          <Route path="rekap/:nisn/pembelanjaan/:purchase_report_id" element={<ReportRecap />} />
        </Route>
        <Route
          path="/auth/login"
          element={
            <ProtectedLoginRoute>
              <LoginPage />
            </ProtectedLoginRoute>
          }
        />
          <Route
                path="/superadmin"
                element={
                  <ProtectedSuperAdminRoute>
                    <AdminLayout isSuperAdmin={true} />
                  </ProtectedSuperAdminRoute>
                }
              >
              <Route index element={<AdminDashboard />} />
              <Route path="pembelanjaan" element={
                <ProtectedSuperAdminRoute>
                  <AdminShopReport />
                </ProtectedSuperAdminRoute>
              } />
              <Route path="pembelanjaan/:purchase_report_id" element={
                <ProtectedSuperAdminRoute>
                  <AdminShopActivity isSuperAdmin={true}/>
                </ProtectedSuperAdminRoute>
              } />
              <Route path="sekolah" element={
                <ProtectedSuperAdminRoute>
                  <AdminSchool/>
                </ProtectedSuperAdminRoute>
              } />
              <Route path="sekolah/:school_id" element={
                <ProtectedSuperAdminRoute>
                  <AdminSchoolDetail/>
                </ProtectedSuperAdminRoute>
              } />
              <Route path="akun" element={
                <ProtectedSuperAdminRoute>
                  <AccountsPage/>
                </ProtectedSuperAdminRoute>
              } />
              <Route path="akun/:user_id" element={
                <ProtectedSuperAdminRoute>
                  <AccountDetailPage/>
                </ProtectedSuperAdminRoute>
              } />
          </Route>
          <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout isSuperAdmin={false}/>
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
