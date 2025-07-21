import React, { useEffect } from "react";
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";
import HomePage from "../Pages/HomePage";
import PageNotFound from "../Layout/PageNotFound";

import AboutPage from "../Pages/AboutPage";
import ProgramsPage from "../Pages/ProgramsPage";
import AdmissionsPage from "../Pages/AdmissionsPage";
import GlobalPage from "../Pages/GlobalPage";
import ContactPage from "../Pages/ContactPage";
import StudentPage from "../Pages/StudentPage";

import CreateApplicationPage from "../Pages/Application/CreateApplicationPage";
import MyApplicationsPage from "../Pages/Application/MyApplicationsPage";
import ApplicationDetail from "../Pages/Application/ApplicationDetail";
import UpdateApplication from "../Pages/Application/UpdateApplication";
import TicketDetail from "../Pages/TicketDetail";
import UploadArticlePage from "../Pages/UploadArticlePage";
import ArticleListPage from "../Pages/ArticleListPage";
import ArticleDetailPage from "../Pages/ArticleDetailPage";
import EditArticlePage from "../Pages/EditArticlePage";
import Admin from "../Admin/AdminHomepage";
import AdminRoute from "./AdminRoutes";
import ConsultantRoute from "./ConsultantRoutes";
import Consultant from "../Consultant/ConsultantHomepage";
import { getCurrentUser } from "../utils/auth";
import Profile from "../Layout/Profile";
import FAQ from "../Pages/FAQ";
import ChatbotPopup from "../Chat/chatbot";
import FAQService from "../Pages/FAQService";
import TicketAssignmentPage from "../Admin/TicketAssignmentPage";
import UserManagementPage from "../Admin/UserManagementPage";

// MainLayout kiểm tra nếu là admin thì chuyển hướng về /admin, consultant về /consultant
const MainLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.role === "Admin") {
      navigate("/admin", { replace: true });
    } else if (user && user.role === "Consultant") {
      navigate("/consultant", { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <ChatbotPopup />
    </>
  );
};

const AdminLayout = () => (
  <>
    {/* <Header /> */}
    <Outlet />
    {/* <Footer /> */}
  </>
);

const ConsultantLayout = () => <Outlet />;

const AuthLayout = () => <Outlet />;

const MainRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Các route dành cho user thường */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/gioi-thieu" element={<AboutPage />} />
          <Route path="/tin-tuc-su-kien" element={<ArticleListPage />} />
          <Route path="/tin-tuc/:id" element={<ArticleDetailPage />} />
          <Route path="/nganh-hoc" element={<ProgramsPage />} />
          <Route path="/tuyen-sinh" element={<AdmissionsPage />} />
          <Route path="/trai-nghiem-toan-cau" element={<GlobalPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="/sinh-vien" element={<StudentPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/FAQ" element={<FAQ />} />
          {/* Xóa route /chat vì chatbot sẽ luôn hiện */}
          <Route path="*" element={<PageNotFound />} />
          <Route path="/applications/new" element={<CreateApplicationPage />} />
          <Route path="/applications/my-applications" element={<MyApplicationsPage />} />
          <Route path="/applications/:id" element={<ApplicationDetail />} />
          <Route path="/applications/:id/edit" element={<UpdateApplication />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
        </Route>

        {/* Các route dành riêng cho admin */}
        <Route element={<AdminLayout />}>
          <Route
            path="/admin/upload-article" 
            element={
              <AdminRoute>
                <UploadArticlePage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/faq" 
            element={
              <AdminRoute>
                <FAQService />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/articles/:id" 
            element={
              <AdminRoute>
                <ArticleDetailPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/articles/edit/:id" 
            element={
              <AdminRoute>
                <EditArticlePage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/ticket-assignment"
            element={
              <AdminRoute>
                <TicketAssignmentPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserManagementPage />
              </AdminRoute>
            }
          />
        </Route>

        {/* Các route dành riêng cho consultant - Sử dụng layout riêng */}
        <Route element={<ConsultantLayout />}>
          <Route
            path="/consultant/*"
            element={
              <ConsultantRoute>
                <Consultant />
              </ConsultantRoute>
            }
          />
        </Route>

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default MainRoutes;
