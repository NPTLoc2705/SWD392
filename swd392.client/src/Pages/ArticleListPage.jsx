import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import { Calendar, Edit, Trash2, Plus } from "lucide-react";

const API_BASE_URL = "https://localhost:7013";

const stripImageTags = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  const imgs = div.querySelectorAll("img");
  imgs.forEach((img) => img.remove());
  return div.innerText;
};

const ArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/Articles`);
        setArticles(res.data.data || []);
      } catch (error) {
        console.error("Failed to load articles", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/Articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Xóa bài viết thất bại!");
    } finally {
      setDeletingId(null);
    }
  };

  // Đường dẫn detail phù hợp với từng role
  const getDetailLink = (id) =>
    user && user.role === "Admin" ? `/articles/${id}` : `/tin-tuc/${id}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner giống ContactPage */}
      <div className="relative h-96 overflow-hidden">
        <img
          src="https://daihoc.fpt.edu.vn/wp-content/uploads/2024/05/doanh-nghiep-3.jpeg"
          alt="Banner Tin tức FPTU"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg uppercase">
            TIN TỨC & SỰ KIỆN
          </h1>
          <p className="text-lg md:text-xl font-medium drop-shadow-lg mb-2">
            Thông tin, tin tức, sự kiện về Đại học FPT
          </p>
          <div className="w-24 h-1 bg-orange-500 rounded-full mt-2"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Danh sách bài viết
            </h2>
            <div className="w-20 h-1 bg-orange-500 rounded-full"></div>
          </div>

          {user && user.role === "Admin" && (
            <Link
              to="/upload-article"
              className="cursor-pointer flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <Plus size={20} className="mr-2" />
              Thêm bài viết
            </Link>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg">Đang tải bài viết...</p>
          </div>
        ) : articles.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Chưa có bài viết nào
            </h3>
            <p className="text-gray-500">
              Hiện tại chưa có bài viết nào được đăng tải.
            </p>
          </div>
        ) : (
          /* Articles Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                {/* Article Image */}
                <Link to={getDetailLink(article.id)} className="block">
                  {article.imagePath ? (
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={`${API_BASE_URL}${article.imagePath}`}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <Calendar
                          size={32}
                          className="text-gray-400 mx-auto mb-2"
                        />
                        <p className="text-gray-500 text-sm font-medium">
                          Không có ảnh
                        </p>
                      </div>
                    </div>
                  )}
                </Link>

                {/* Article Content */}
                <div className="p-6">
                  {/* Date */}
                  <div className="flex items-center text-orange-500 text-sm font-medium mb-3">
                    <Calendar size={14} className="mr-2" />
                    {article.createdAt &&
                      new Date(article.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                  </div>

                  {/* Title */}
                  <Link to={getDetailLink(article.id)}>
                    <h2
                      className="text-xl font-bold text-gray-800 mb-3 hover:text-orange-600 transition-colors duration-200 line-clamp-2 leading-tight"
                      title={article.title}
                    >
                      {article.title}
                    </h2>
                  </Link>

                  {/* Content Preview */}
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {stripImageTags(article.content)}
                  </p>

                  {/* Actions for Admin */}
                  {user && user.role === "Admin" && (
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => navigate(`/articles/edit/${article.id}`)}
                        className="flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm shadow transition-all duration-200 transform hover:scale-105"
                      >
                        <Edit size={14} className="mr-2" />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        disabled={deletingId === article.id}
                        className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm shadow transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                      >
                        {deletingId === article.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Đang xóa...
                          </>
                        ) : (
                          <>
                            <Trash2 size={14} className="mr-2" />
                            Xóa
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Read More Button for non-admin */}
                  {(!user || user.role !== "Admin") && (
                    <div className="pt-4 border-t border-gray-100">
                      <Link
                        to={getDetailLink(article.id)}
                        className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors duration-200"
                      >
                        Đọc thêm
                        <svg
                          className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics Section */}
        {articles.length > 0 && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100">
              <Calendar size={20} className="text-orange-500 mr-2" />
              <span className="text-gray-700 font-medium">
                Tổng cộng{" "}
                <span className="text-orange-600 font-bold">
                  {articles.length}
                </span>{" "}
                bài viết
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleListPage;
