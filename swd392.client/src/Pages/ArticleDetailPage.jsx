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
    <div className="min-h-screen relative">
      {/* Ảnh nền bên trái */}
      <div 
        className="fixed left-0 top-0 w-[200px] h-full z-0"
        style={{
          backgroundImage: "url('https://www.google.com/url?sa=i&url=https%3A%2F%2Ftuoitre.vn%2Ftruong-dai-hoc-fpt-tien-phong-dao-tao-nguon-nhan-luc-chat-luong-cao-20230427162750519.htm&psig=AOvVaw3eSdIUIhj3u_6Yq07-u-yG&ust=1749892216477000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCfrNOG7o0DFQAAAAAdAAAAABAf')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15
        }}
      />
      
      {/* Ảnh nền bên phải */}
      <div 
        className="fixed right-0 top-0 w-[200px] h-full z-0"
        style={{
          backgroundImage: "url('https://daihoc.fpt.edu.vn/media/2022/06/DSC04631-2048x1365.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15
        }}
      />

      {/* Nội dung chính */}
      <div className="max-w-3xl mx-auto px-4 py-10 relative z-10 bg-white/90">
        <div className="flex items-center justify-between mb-6">
          <h1 
            className="text-3xl font-bold text-gray-900 truncate max-w-[60%]" 
            title={article.title}
          >
            {article.title}
          </h1>
          <div className="flex gap-2 flex-wrap flex-shrink-0">
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
    </div>
  );
};

export default ArticleDetailPage;