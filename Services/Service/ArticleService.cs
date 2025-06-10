using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
using Repo;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Services.Service
{
    public class ArticleService : IArticleService
    {
        private readonly IArticleRepo _articlesRepo;

        public ArticleService(IArticleRepo articlesRepository)
        {
            _articlesRepo = articlesRepository ?? throw new ArgumentNullException(nameof(articlesRepository));
        }

        public async Task<bool> DeleteArticle(string id)
        {
            return await _articlesRepo.DeleteArticle(id);
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
                throw;
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

        public async Task<ArticleResponse> UpdateArticle(string id, UpdateArticleRequest updateArticleRequest, byte[] imageData = null)
        {
            if (string.IsNullOrWhiteSpace(id))
                throw new ArgumentException("Article ID cannot be null or empty", nameof(id));

            if (updateArticleRequest == null)
                throw new ArgumentNullException(nameof(updateArticleRequest));

            try
            {
                var existingArticle = await _articlesRepo.GetArticleById(id);
                if (existingArticle == null)
                {
                    throw new ArgumentException("Article not found");
                }

                var articleToUpdate = new Articles
                {
                    id = id,
                    title = updateArticleRequest.Title,
                    content = updateArticleRequest.Content,
                    imagePath = updateArticleRequest.ImagePath ?? existingArticle.imagePath,
                    published_by = existingArticle.published_by,
                    created_at = existingArticle.created_at,
                    updated_at = DateTime.UtcNow
                };

                var updatedArticle = await _articlesRepo.UpdateArticle(articleToUpdate, imageData);

                return MapToArticleResponse(updatedArticle);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in service while updating article: {ex.Message}", ex);
            }
        }

        public async Task<ArticleResponse> UploadArticle(CreateArticleRequest createArticleRequest, byte[] imageData)
        {
            if (createArticleRequest == null)
                throw new ArgumentNullException(nameof(createArticleRequest));

            try
            {
                var article = new Articles
                {
                    title = createArticleRequest.Title,
                    content = createArticleRequest.Content,
                    imagePath = null, // Will be set in DAO
                    published_by = createArticleRequest.PublishedBy,
                    created_at = DateTime.UtcNow,
                    updated_at = DateTime.UtcNow
                };

                var createdArticle = await _articlesRepo.UploadArticle(article, imageData);

                return MapToArticleResponse(createdArticle);
            }
            catch (ValidationException)
            {
                throw;
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
                ImagePath = article.imagePath,
                PublishedBy = article.published_by,
                AuthorName = article.User?.name,
                CreatedAt = article.created_at,
                UpdatedAt = article.updated_at
            };
        }
    }
}