import React, { useEffect } from "react";
import { BrowserRouter, Outlet, Route, Routes, useNavigate } from "react-router-dom";
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
    </>
  );
};

// AdminLayout KHÔNG kiểm tra role, chỉ render layout cho admin
const AdminLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

// ConsultantLayout - KHÔNG có Header/Footer vì ConsultantHomepage tự quản lý layout
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
          <Route path="*" element={<PageNotFound />} />
        </Route>

        {/* Các route dành riêng cho admin */}
        <Route element={<AdminLayout />}>
          <Route
            path="/upload-article"
            element={
              <AdminRoute>
                <UploadArticlePage />
              </AdminRoute>
            }
          />
          <Route
            path="/articles"
            element={
              <AdminRoute>
                <ArticleListPage />
              </AdminRoute>
            }
          />
          <Route
            path="/articles/:id"
            element={
              <AdminRoute>
                <ArticleDetailPage />
              </AdminRoute>
            }
          />
          <Route
            path="/articles/edit/:id"
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