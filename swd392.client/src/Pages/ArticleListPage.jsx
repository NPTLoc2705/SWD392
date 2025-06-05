import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">📚 Articles</h1>

      {loading ? (
        <p className="text-gray-500">Loading articles...</p>
      ) : articles.length === 0 ? (
        <p className="text-gray-500">No articles found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/articles/${article.id}`}
              className="block rounded-xl overflow-hidden shadow hover:shadow-md transition bg-white border border-gray-200"
            >
              {article.imagePath ? (
                <img
                  src={`${API_BASE_URL}${article.imagePath}`}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {stripImageTags(article.content)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleListPage;
