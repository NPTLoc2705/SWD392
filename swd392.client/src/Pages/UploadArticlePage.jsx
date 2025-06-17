import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadArticlePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (coverImage) formData.append("image", coverImage);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("https://localhost:7013/api/Articles", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(res.data.message || "Đăng bài thành công!");
      setTitle("");
      setContent("");
      setCoverImage(null);
    } catch (error) {
      setMessage(error.response?.data?.message || "Đăng bài thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white font-sans min-h-screen">
      <section className="relative h-[220px] md:h-[300px] flex items-center justify-center rounded-b-3xl shadow-lg mb-10 overflow-hidden">
        <img
          src="https://daihoc.fpt.edu.vn/wp-content/uploads/2024/05/doanh-nghiep-3.jpeg"
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover rounded-b-3xl"
        />
        <div className="absolute inset-0 bg-black/40 rounded-b-3xl"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-2 uppercase">
            Đăng bài viết mới
          </h1>
          <p className="text-lg md:text-xl text-white font-medium drop-shadow-lg">
            Chia sẻ thông tin, tin tức và kiến thức đến cộng đồng FPTU
          </p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="relative">
          {/* Ảnh hai bên form */}
          <img
            src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80"
            alt="side left"
            className="hidden md:block absolute left-[-170px] top-1/2 -translate-y-1/2 w-36 h-56 object-cover rounded-2xl shadow-lg"
            style={{ zIndex: 1 }}
          />
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80"
            alt="side right"
            className="hidden md:block absolute right-[-170px] top-1/2 -translate-y-1/2 w-36 h-56 object-cover rounded-2xl shadow-lg"
            style={{ zIndex: 1 }}
          />
          <div className="bg-white rounded-2xl shadow-xl p-8 relative z-10">
            {/* Nút chuyển về danh sách bài viết */}
            <div className="flex justify-end mb-6">
              <button
                type="button"
                onClick={() => navigate("/articles")}
                className="bg-orange-100 text-orange-700 px-5 py-2 rounded-xl font-semibold shadow hover:bg-orange-200 transition"
              >
                Danh sách bài viết
              </button>
            </div>
            {message && (
              <div
                className={`mb-6 px-4 py-3 rounded-xl text-center font-semibold ${
                  message.toLowerCase().includes("thành công") || message.toLowerCase().includes("success")
                    ? "bg-green-100 text-green-700 border border-green-400"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Tiêu đề */}
              <div>
                <label htmlFor="article-title" className="block font-semibold text-orange-700 mb-2">
                  Tiêu đề bài viết <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="article-title"
                  className="w-full border border-orange-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition text-lg"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Nhập tiêu đề bài viết..."
                />
              </div>

              {/* Ảnh đại diện */}
              <div>
                <label htmlFor="cover-image-upload" className="block font-semibold text-orange-700 mb-2">
                  Ảnh đại diện bài viết
                </label>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="cover-image-upload"
                    className="cursor-pointer bg-orange-500 text-white px-5 py-2 rounded-xl shadow hover:bg-orange-600 transition"
                  >
                    Chọn ảnh
                    <input
                      type="file"
                      id="cover-image-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setCoverImage(e.target.files[0])}
                    />
                  </label>
                  {coverImage ? (
                    <span className="text-gray-700 text-sm">
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
                    <span className="text-gray-400 text-sm">Chưa chọn ảnh</span>
                  )}
                </div>
                {coverImage && (
                  <img
                    src={URL.createObjectURL(coverImage)}
                    alt="Preview"
                    className="mt-4 rounded-xl shadow max-h-48"
                  />
                )}
              </div>

              {/* Nội dung */}
              <div>
                <label htmlFor="article-content" className="block font-semibold text-orange-700 mb-2">
                  Nội dung <span className="text-red-500">*</span>
                </label>
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
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:15px } img { max-width: 100%; height: auto; }",
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

           
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold shadow hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Đang đăng..." : "Đăng bài viết"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadArticlePage;