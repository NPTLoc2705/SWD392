using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BO.dtos.Request;
using BO.dtos.Response;
namespace Services.Service
{
    public interface IArticleService
    {
        Task<ArticleResponse> UploadArticle(CreateArticleRequest createArticleRequest);

        // Read operations  
        Task<List<ArticleResponse>> GetAllArticles();
        Task<ArticleResponse> GetArticleById(string id);
        Task<List<ArticleResponse>> GetArticlesByUserId(int userId);
        Task<PaginatedArticleResponse> GetArticlesPaginated(int pageNumber, int pageSize);

        // Update operations
        Task<ArticleResponse> UpdateArticle(string id, UpdateArticleRequest updateArticleRequest);

        // Delete operations
        Task<bool> DeleteArticle(string id);

    }
}
