using BO.Models;
using DAL;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repo
{
    public class ArticlesRepo : IArticleRepo
    {
        private readonly ArticlesDAO _articlesDAO;

        public ArticlesRepo(ArticlesDAO articlesDAO)
        {
            _articlesDAO = articlesDAO;
        }

        public async Task<bool> DeleteArticle(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                {
                    throw new ArgumentException("Article ID cannot be null or empty");
                }

                return await _articlesDAO.DeleteArticle(id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in repository while deleting article: {ex.Message}", ex);
            }
        }

        public async Task<List<Articles>> GetAllArticles()
        {
            try
            {
                return await _articlesDAO.GetAllArticles();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in repository while retrieving all articles: {ex.Message}", ex);
            }
        }

        public async Task<Articles> GetArticleById(string id)
        {
            try
            {

                return await _articlesDAO.GetArticleById(id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in repository while retrieving article by ID: {ex.Message}", ex);
            }
        }

        public async Task<List<Articles>> GetArticlesByUserId(int userId)
        {
            try
            {
                if (userId <= 0)
                {
                    throw new ArgumentException("User ID must be greater than 0");
                }

                return await _articlesDAO.GetArticlesByUserId(userId);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in repository while retrieving articles by user ID: {ex.Message}", ex);
            }
        }

        public async Task<(List<Articles> articles, int totalCount)> GetArticlesPaginated(int pageNumber, int pageSize)
        {
            try
            {
                if (pageNumber <= 0)
                {
                    throw new ArgumentException("Page number must be greater than 0");
                }

                if (pageSize <= 0 || pageSize > 100)
                {
                    throw new ArgumentException("Page size must be between 1 and 100");
                }

                return await _articlesDAO.GetArticlesPaginated(pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in repository while retrieving paginated articles: {ex.Message}", ex);
            }
        }

        public async Task<Articles> UpdateArticle(Articles article, byte[] imageData = null)
        {
            try
            {
                if (article == null)
                {
                    throw new ArgumentNullException(nameof(article), "Article cannot be null");
                }
                var exists = await _articlesDAO.ArticleExists(article.id);
                if (!exists)
                {
                    throw new ArgumentException("Article not found");
                }
                return await _articlesDAO.UpdateArticle(article, imageData);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in repository while updating article: {ex.Message}", ex);
            }
        }

        public async Task<Articles> UploadArticle(Articles article, byte[] imageData = null)
        {
            try
            {
                return await _articlesDAO.Upload(article, imageData);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in repository while uploading article: {ex.Message}", ex);
            }
        }
    }
}