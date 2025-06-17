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
  const [coverImage, setCoverImage] = useState(null);
  const [currentImagePath, setCurrentImagePath] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // Modified to include message type

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/Articles/${id}`);
        const article = res.data.data;
        setTitle(article.title);
        setContent(article.content);
        setCurrentImagePath(article.imagePath || "");
      } catch (error) {
        setMessage({ text: "Failed to load article.", type: "error" });
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

    if (currentImagePath && !coverImage) {
      formData.append("imagePath", currentImagePath);
    }

    if (coverImage) {
      formData.append("image", coverImage);
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_BASE_URL}/api/Articles/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage({ 
        text: "Cập nhật bài viết thành công!", 
        type: "success" 
      });
      navigate(`/articles/${id}`);
    } catch (error) {
      console.error("Update error:", error.response?.data);
      setMessage({ 
        text: error.response?.data?.message || "Cập nhật bài viết thất bại.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h1 className="text-2xl font-semibold mb-4 truncate" title={title}>
        {title || "Edit Article"}
      </h1>
      
      {message.text && (
        <p className={`mb-4 ${
          message.type === 'error' ? 'text-red-500' : 'text-green-500'
        }`}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="article-title"
            className="block font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="article-title"
            className="w-full border border-gray-300 p-2 rounded-md mt-1 focus:ring-blue-500 focus:border-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label
            htmlFor="article-content"
            className="block font-medium text-gray-700"
          >
            Content
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
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | link image media | preview fullscreen | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px } img { max-width: 100%; height: auto; }",
              file_picker_callback: function (callback, value, meta) {
                if (meta.filetype === "image") {
                  let input = document.createElement("input");
                  input.setAttribute("type", "file");
                  input.setAttribute("accept", "image/*");
                  input.onchange = function () {
                    let file = this.files[0];
                    let reader = new FileReader();
                    reader.onload = function () {
                      let id = "blobid" + new Date().getTime();
                      let blobCache =
                        window.tinymce.activeEditor.editorUpload.blobCache;
                      let base64 = reader.result.split(",")[1];
                      let blobInfo = blobCache.create(id, file, base64);
                      blobCache.add(blobInfo);
                      callback(blobInfo.blobUri(), { title: file.name });
                    };
                    reader.readAsDataURL(file);
                  };
                  input.click();
                }
              },
              images_upload_handler: (blobInfo, progress) =>
                new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => {
                    resolve(reader.result);
                  };
                  reader.onerror = () => {
                    reject("File reading failed");
                  };
                  reader.readAsDataURL(blobInfo.blob());
                }),
            }}
          />
        </div>

        <div>
          <label
            htmlFor="cover-image-upload"
            className="block font-medium text-gray-700 mb-1"
          >
            Update Cover Image
          </label>
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
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition-colors duration-200"
            >
              Choose File
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
                  (Remove)
                </button>
              </span>
            ) : (
              <span className="text-gray-500 text-sm">No new file chosen</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Article"}
        </button>
      </form>
    </div>
  );
};

export default EditArticlePage;