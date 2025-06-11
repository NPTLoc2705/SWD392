import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";

const API_BASE_URL = "https://localhost:7013";

const EditArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null); // new file
  const [currentImagePath, setCurrentImagePath] = useState(""); // existing image path
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/Articles/${id}`);
        const article = res.data.data;
        setTitle(article.title);
        setContent(article.content);
        setCurrentImagePath(article.imagePath || "");
      } catch (error) {
        setMessage("Failed to load article.");
      }
    };

    fetchArticle();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (coverImage) formData.append("image", coverImage);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${API_BASE_URL}/api/Articles/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(res.data.message || "Article updated successfully!");
      setTimeout(() => navigate(`/articles/${id}`), 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update article.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Chỉnh sửa bài viết</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-semibold shadow transition"
          >
            Quay lại trước
          </button>
          <Link
            to="/upload-article"
            className="bg-green-100 text-green-700 px-4 py-2 rounded-md font-semibold shadow hover:bg-green-200 transition"
          >
            Thêm bài viết
          </Link>
          <Link
            to="/articles"
            className="bg-orange-100 text-orange-700 px-4 py-2 rounded-md font-semibold shadow hover:bg-orange-200 transition"
          >
            Danh sách bài viết
          </Link>
        </div>
      </div>
      {message && (
        <p
          className={`mb-4 px-4 py-2 rounded text-center font-semibold ${
            message.toLowerCase().includes("thành công") ||
            message.toLowerCase().includes("success") ||
            message.toLowerCase().includes("updated")
              ? "bg-green-100 text-green-700 border border-green-400"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="article-title" className="block font-medium text-gray-700">Tiêu đề</label>
          <input
            type="text"
            id="article-title"
            className="w-full border border-gray-300 p-2 rounded-md mt-1 focus:ring-orange-400 focus:border-orange-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="article-content" className="block font-medium text-gray-700">Nội dung</label>
          <Editor
            id="article-content"
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            value={content}
            onEditorChange={(newContent) => setContent(newContent)}
            init={{
              height: 400,
              menubar: true,
              plugins: [
                "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                "insertdatetime", "media", "table", "code", "help", "wordcount"
              ],
              toolbar:
                "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | link image media | preview fullscreen | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px } img { max-width: 100%; height: auto; }",
              file_picker_callback: function (callback, value, meta) {
                if (meta.filetype === 'image') {
                  let input = document.createElement('input');
                  input.setAttribute('type', 'file');
                  input.setAttribute('accept', 'image/*');
                  input.onchange = function () {
                    let file = this.files[0];
                    let reader = new FileReader();
                    reader.onload = function () {
                      let id = 'blobid' + (new Date()).getTime();
                      let blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                      let base64 = reader.result.split(',')[1];
                      let blobInfo = blobCache.create(id, file, base64);
                      blobCache.add(blobInfo);
                      callback(blobInfo.blobUri(), { title: file.name });
                    };
                    reader.readAsDataURL(file);
                  };
                  input.click();
                }
              },
              images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                  resolve(reader.result);
                };
                reader.onerror = () => {
                  reject('File reading failed');
                };
                reader.readAsDataURL(blobInfo.blob());
              })
            }}
          />
        </div>

        <div>
          <label htmlFor="cover-image-upload" className="block font-medium text-gray-700 mb-1">Ảnh đại diện</label>
          {currentImagePath && !coverImage && (
            <img
              src={`${API_BASE_URL}${currentImagePath}`}
              alt="Current Cover"
              className="w-32 h-20 object-cover rounded mb-2"
            />
          )}

          <div className="flex items-center space-x-3">
            <label
              htmlFor="cover-image-upload"
              className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-orange-600 transition-colors duration-200"
            >
              Chọn ảnh mới
              <input
                type="file"
                id="cover-image-upload"
                accept="image/*"
                className="hidden"
                onChange={(e) => setCoverImage(e.target.files[0])}
              />
            </label>
            {coverImage ? (
              <span className="text-gray-600 text-sm">
                {coverImage.name}
                <button
                  type="button"
                  onClick={() => setCoverImage(null)}
                  className="ml-2 text-red-500 hover:text-red-700 text-xs"
                >
                  (Xóa)
                </button>
              </span>
            ) : (
              <span className="text-gray-500 text-sm">Chưa chọn ảnh mới</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Đang cập nhật..." : "Cập nhật bài viết"}
        </button>
      </form>
    </div>
  );
};

export default EditArticlePage;