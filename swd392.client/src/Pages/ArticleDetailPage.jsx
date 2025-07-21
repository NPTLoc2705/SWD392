import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { getCurrentUser } from "../utils/auth";
import {
  ArrowLeft,
  Calendar,
  User,
  Edit3,
  Trash2,
  Loader2,
  Clock,
  Eye,
} from "lucide-react";

const API_BASE_URL = "https://localhost:7013";

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");
  const user = getCurrentUser();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/Articles/${id}`);
        setArticle(res.data.data);
      } catch (error) {
        setError("Không thể tải bài viết");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/Articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/articles");
    } catch (err) {
      setError("Xóa bài viết thất bại!");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Ngày không hợp lệ";
      }
      return date.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Ngày không hợp lệ";
    }
  };

  const formatShortDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Ngày không hợp lệ";
      }
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Ngày không hợp lệ";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={48} className="animate-spin text-orange-600 mb-4" />
          <span className="text-gray-600 text-lg">Đang tải bài viết...</span>
          <span className="text-gray-500 text-sm mt-2">
            Vui lòng chờ trong giây lát
          </span>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="text-red-500 text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Không tìm thấy bài viết
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "Bài viết này không tồn tại hoặc đã bị xóa"}
            </p>
            <Link
              to={
                user && user.role === "Admin" ? "/articles" : "/tin-tuc-su-kien"
              }
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              <ArrowLeft size={20} className="mr-2" />
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <div className="top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <Link
              to={
                user && user.role === "Admin" ? "/articles" : "/tin-tuc-su-kien"
              }
              className="inline-flex items-center text-gray-600 hover:text-orange-600 transition-colors font-medium"
            >
              <ArrowLeft size={20} className="mr-2" />
              Quay lại danh sách
            </Link>

            {/* Admin Actions */}
            {user && user.role === "Admin" && (
              <div className="flex items-center space-x-3">
                <Link
                  to={`/articles/edit/${article.id}`}
                  className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  <Edit3 size={16} className="mr-2" />
                  Chỉnh sửa
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {deleteLoading ? (
                    <Loader2 size={16} className="mr-2 animate-spin" />
                  ) : (
                    <Trash2 size={16} className="mr-2" />
                  )}
                  {deleteLoading ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-0 max-w-6xl pb-10">
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Article Header */}
          <div className="px-8 py-8 border-b border-gray-100">
            {/* Category & Date */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                  TIN TỨC
                </span>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar size={14} className="mr-1" />
                  {formatShortDate(article.createdAt)}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-1">
                  <span className="text-red-700 text-sm font-medium">
                    {error}
                  </span>
                </div>
              )}
            </div>

            {/* Article Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
              {article.title}
            </h1>

            {/* Article Meta */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                {article.authorName && (
                  <div className="flex items-center text-gray-600">
                    <User size={16} className="mr-2" />
                    <span className="font-medium">{article.authorName}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock size={14} className="mr-1" />
                  {formatDate(article.createdAt)}
                </div>
                
              </div>

              
            </div>
          </div>

          {/* Featured Image */}
          {(article.imagePath || article.image) && (
            <div className="px-8 py-6">
              <div className="aspect-video overflow-hidden rounded-lg shadow-lg">
                <img
                  src={
                    article.imagePath
                      ? `${API_BASE_URL}${article.imagePath}`
                      : typeof article.image === "string"
                      ? article.image
                      : `data:image/jpeg;base64,${article.image}`
                  }
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Article Body */}
          <div className="px-8 py-6">
            <div
              className="article-content prose prose-lg max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
                prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
                prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
                prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-justify
                prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-em:text-gray-700 prose-em:italic
                prose-ul:text-gray-700 prose-ol:text-gray-700
                prose-li:text-gray-700 prose-li:leading-relaxed prose-li:mb-2
                prose-img:rounded-lg prose-img:shadow-md prose-img:border prose-img:border-gray-200
                prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50 
                prose-blockquote:italic prose-blockquote:text-gray-800 prose-blockquote:font-medium
                prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-6
                prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4
                prose-table:border prose-table:border-gray-200
                prose-th:bg-gray-50 prose-th:font-semibold prose-th:text-gray-900
                prose-td:border-t prose-td:border-gray-200"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Article Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <p>
                  Bài viết được đăng tải {formatDate(article.createdAt)}
                </p>
                {article.updatedAt &&
                  article.updatedAt !== article.createdAt && (
                    <p className="mt-1">
                      Cập nhật lần cuối: {formatDate(article.updatedAt)}
                    </p>
                  )}
              </div>

              {user && user.role === "Admin" && (
                <Link
                  to={`/articles/edit/${article.id}`}
                  className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  <Edit3 size={16} className="mr-2" />
                  Chỉnh sửa bài viết
                </Link>
              )}
            </div>
          </div>
        </article>

       
      </div>

      {/* Custom CSS for article styling */}
      <style jsx>{`
        .article-content p:first-child {
          font-size: 1.125rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 1.5rem;
        }

        .article-content img {
          margin: 2rem auto;
          display: block;
        }

        .article-content blockquote p {
          margin: 0;
          font-size: 1rem;
        }

        .article-content h2:first-child,
        .article-content h3:first-child {
          margin-top: 0;
        }

        .article-content ul,
        .article-content ol {
          margin: 1.5rem 0;
        }

        .article-content li {
          margin-bottom: 0.5rem;
        }

        .article-content table {
          width: 100%;
          margin: 2rem 0;
        }

        .article-content th,
        .article-content td {
          padding: 0.75rem;
          text-align: left;
        }
      `}</style>
    </div>
  );
};

export default ArticleDetailPage;
