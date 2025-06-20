import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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

  return (
    <div className="bg-[#f7f7f7] min-h-screen pb-10">
      {/* Banner quản lý */}
      <section className="relative h-[180px] md:h-[240px] flex items-center justify-center rounded-b-3xl shadow-lg mb-10 overflow-hidden">
        <img
          src="https://daihoc.fpt.edu.vn/wp-content/uploads/2024/05/doanh-nghiep-3.jpeg"
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover rounded-b-3xl"
        />
        <div className="absolute inset-0 bg-black/40 rounded-b-3xl"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-2 uppercase">
            Quản lý bài viết & Tin tức FPTU
          </h1>
          <p className="text-base md:text-lg text-white font-medium drop-shadow-lg">
            Thông tin, tin tức, sự kiện về Đại học FPT
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-orange-700 uppercase tracking-wide">
            Danh sách bài viết
          </h2>
          <Link
            to="/upload-article"
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-xl font-semibold shadow transition"
          >
            Thêm bài viết
          </Link>
        </div>
        {loading ? (
          <div className="text-center text-gray-500 py-10">Đang tải...</div>
        ) : articles.length === 0 ? (
          <div className="text-center text-gray-400 py-10 italic">Chưa có bài viết nào.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div
                key={article.id}
                className="rounded-2xl overflow-hidden shadow hover:shadow-xl transition bg-white border border-gray-100 flex flex-col"
              >
                <Link to={`/articles/${article.id}`}>
                  {article.imagePath ? (
                    <img
                      src={`${API_BASE_URL}${article.imagePath}`}
                      alt={article.title}
                      className="w-full h-44 object-cover"
                    />
                  ) : (
                    <div className="w-full h-44 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </Link>
                <div className="p-5 flex-1 flex flex-col">
                  <Link to={`/articles/${article.id}`}>
                    <h2
                      className="text-lg font-bold text-orange-700 mb-1 hover:underline transition line-clamp-2"
                      title={article.title}
                    >
                      {article.title}
                    </h2>
                  </Link>
                  <div className="text-gray-500 text-xs mb-2">
                    {article.createdAt && new Date(article.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                    {stripImageTags(article.content)}
                  </p>
                  <div className="flex gap-2 mt-auto flex-wrap">
                    <button
                      onClick={() => navigate(`/articles/edit/${article.id}`)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow transition"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      disabled={deletingId === article.id}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow transition disabled:opacity-50"
                    >
                      {deletingId === article.id ? "Đang xóa..." : "Xóa"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleListPage;