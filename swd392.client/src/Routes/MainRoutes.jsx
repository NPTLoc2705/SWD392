import React from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";
import HomePage from "../Pages/HomePage";
import PageNotFound from "../Layout/PageNotFound";

import AboutPage from "../Pages/AboutPage";
import NewsPage from "../Pages/NewsPage";
import ProgramsPage from "../Pages/ProgramsPage";
import AdmissionsPage from "../Pages/AdmissionsPage";
import GlobalPage from "../Pages/GlobalPage";

const MainLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

const AuthLayout = () => <Outlet />;

const MainRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/gioi-thieu" element={<AboutPage />} />
          <Route path="/tin-tuc-su-kien" element={<NewsPage />} />
          <Route path="/nganh-hoc" element={<ProgramsPage />} />
          <Route path="/tuyen-sinh" element={<AdmissionsPage />} />
          <Route path="/trai-nghiem-toan-cau" element={<GlobalPage />} />
          
          <Route path="*" element={<PageNotFound />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default MainRoutes;