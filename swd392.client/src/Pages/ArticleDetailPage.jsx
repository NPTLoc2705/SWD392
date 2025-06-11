import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://localhost:7013";

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");

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

  if (loading) return <div className="p-10 text-gray-600">Đang tải...</div>;
  if (!article) return <div className="p-10 text-red-500">{error || "Không tìm thấy bài viết"}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{article.title}</h1>
        <div className="flex gap-2 flex-wrap">
          <Link
            to="/articles"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl font-semibold shadow transition"
          >
            Về danh sách
          </Link>
          <Link
            to={`/articles/edit/${article.id}`}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold shadow transition"
          >
            Sửa
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold shadow transition disabled:opacity-50"
          >
            {deleteLoading ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      </div>
      {(article.imagePath || article.image) && (
        <img
          src={
            article.imagePath
              ? `${API_BASE_URL}${article.imagePath}`
              : typeof article.image === "string"
                ? article.image
                : `data:image/jpeg;base64,${article.image}`
          }
          alt={article.title}
          className="w-full max-h-96 object-cover rounded-xl mb-6"
        />
      )}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  );
};

export default ArticleDetailPage;