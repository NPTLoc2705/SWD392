using BO.dtos.Request;
using BO.dtos.Response;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Services.Service
{
    public interface IArticleService
    {
        // Create/Upload operations
        Task<ArticleResponse> UploadArticle(CreateArticleRequest createArticleRequest, byte[] imageData);

        // Read operations  
        Task<List<ArticleResponse>> GetAllArticles();
        Task<ArticleResponse> GetArticleById(string id);
        Task<List<ArticleResponse>> GetArticlesByUserId(int userId);

        // Update operations
        Task<ArticleResponse> UpdateArticle(string id, UpdateArticleRequest updateArticleRequest, byte[] imageData = null);

        // Delete operations
        Task<bool> DeleteArticle(string id);
    }
}