using BO.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repo
{
    public interface IArticleRepo
    {
        // Create/Upload operations
        Task<Articles> UploadArticle(Articles article, byte[] imageData = null);

        // Read operations
        Task<List<Articles>> GetAllArticles();
        Task<Articles> GetArticleById(string id);
        Task<List<Articles>> GetArticlesByUserId(int userId);
        Task<(List<Articles> articles, int totalCount)> GetArticlesPaginated(int pageNumber, int pageSize);

        // Update operations
        Task<Articles> UpdateArticle(Articles article, byte[] imageData = null);

        // Delete operations
        Task<bool> DeleteArticle(string id);
    }
}