using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
using Microsoft.Extensions.Configuration;
using Repo;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Service
{
    public class ArticleService : IArticleService
    {
        private readonly IArticleRepo _articlesRepo;
        private readonly IConfiguration _configuration;

        public ArticleService(IArticleRepo articlesRepository, IConfiguration configuration)
        {
            _articlesRepo = articlesRepository ?? throw new ArgumentNullException(nameof(articlesRepository));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }
        public async Task<bool> DeleteArticle(string id)
        {
           return  await _articlesRepo.DeleteArticle(id);
        }

        public async Task<List<ArticleResponse>> GetAllArticles()
        {
            var articles = await _articlesRepo.GetAllArticles();
            return articles.Select(MapToArticleResponse).ToList();
        }

        public async Task<ArticleResponse> GetArticleById(string id)
        {
            try
            {
                var article = await _articlesRepo.GetArticleById(id);

                if (article == null)
                    return null;

                return MapToArticleResponse(article);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in service while retrieving article by ID: {ex.Message}", ex);
            }
        }

        public async Task<List<ArticleResponse>> GetArticlesByUserId(int userId)
        {
            try
            {
                var articles = await _articlesRepo.GetArticlesByUserId(userId);
                return articles.Select(MapToArticleResponse).ToList();
            }
            catch (ArgumentException)
            {
                throw; // Re-throw argument exceptions
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in service while retrieving articles by user ID: {ex.Message}", ex);
            }
        }

        public async Task<PaginatedArticleResponse> GetArticlesPaginated(int pageNumber, int pageSize)
        {
            try
            {
                var (articles, totalCount) = await _articlesRepo.GetArticlesPaginated(pageNumber, pageSize);

                var articleResponses = articles.Select(MapToArticleResponse).ToList();

                return new PaginatedArticleResponse
                {
                    Articles = articleResponses,
                    CurrentPage = pageNumber,
                    PageSize = pageSize,
                    TotalCount = totalCount,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize),
                    HasNext = pageNumber < Math.Ceiling((double)totalCount / pageSize),
                    HasPrevious = pageNumber > 1
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in service while retrieving paginated articles: {ex.Message}", ex);
            }
        }

        public async Task<ArticleResponse> UpdateArticle(string id, UpdateArticleRequest updateArticleRequest)
        {
            if (string.IsNullOrWhiteSpace(id))
                throw new ArgumentException("Article ID cannot be null or empty", nameof(id));

            if (updateArticleRequest == null)
                throw new ArgumentNullException(nameof(updateArticleRequest));

            try
            {
                // Check if article exists
                var existingArticle = await _articlesRepo.GetArticleById(id);
                if (existingArticle == null)
                {
                    throw new ArgumentException("Article not found");
                }

                // Map DTO to Entity for update
                var articleToUpdate = new Articles
                {
                    id = id,
                    title = updateArticleRequest.Title,
                    content = updateArticleRequest.Content,
                    image = updateArticleRequest.Image,
                    published_by = existingArticle.published_by, // Keep original publisher
                    created_at = existingArticle.created_at, // Keep original creation time
                    updated_at = DateTime.UtcNow
                };

                var updatedArticle = await _articlesRepo.UpdateArticle(articleToUpdate);

                // Map Entity to Response DTO
                return MapToArticleResponse(updatedArticle);
            }
            catch (ArgumentException)
            {
                throw; // Re-throw argument exceptions
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in service while updating article: {ex.Message}", ex);
            }
        }

        public async Task<ArticleResponse> UploadArticle(CreateArticleRequest createArticleRequest)
        {
            if (createArticleRequest == null)
                throw new ArgumentNullException(nameof(createArticleRequest));

            try
            {
                // Map DTO to Entity
                var article = new Articles
                {
                    title = createArticleRequest.Title,
                    content = createArticleRequest.Content,
                    image = createArticleRequest.Image,
                    published_by = createArticleRequest.PublishedBy,
                    created_at = DateTime.UtcNow,
                    updated_at = DateTime.UtcNow
                };

                var createdArticle = await _articlesRepo.UploadArticle(article);

                // Map Entity to Response DTO
                return MapToArticleResponse(createdArticle);
            }
            catch (ValidationException)
            {
                throw; // Re-throw validation exceptions
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in service while uploading article: {ex.Message}", ex);
            }
        }


        private ArticleResponse MapToArticleResponse(Articles article)
        {
            if (article == null)
                return null;

            return new ArticleResponse
            {
                Id = article.id,
                Title = article.title,
                Content = article.content,
                Image = article.image,
                PublishedBy = article.published_by,
                AuthorName = article.User?.name,
                CreatedAt = article.created_at,
                UpdatedAt = article.updated_at  
            };
        }
    }
}
