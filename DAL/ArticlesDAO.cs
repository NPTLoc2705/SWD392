using BO.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class ArticlesDAO
    {
        private readonly AppDbContext _appDbContext;

        public ArticlesDAO(AppDbContext Context)
        {
            _appDbContext = Context;
        }

        // Upload/Create a new article
        public async Task<Articles> Upload(Articles articles)
        {
            try
            {
                var article = new Articles
                {
                    title = articles.title,
                    image = articles.image,
                    content = articles.content,
                    published_by = articles.published_by,
                    created_at = DateTime.UtcNow,
                    updated_at = DateTime.UtcNow
                };

                _appDbContext.Articles.Add(article);
                await _appDbContext.SaveChangesAsync();

                return article;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error uploading article: {ex.Message}", ex);
            }
        }

        // Get all articles
        public async Task<List<Articles>> GetAllArticles()
        {
            try
            {
                return await _appDbContext.Articles
                    .Include(a => a.User)
                    .OrderByDescending(a => a.created_at)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving articles: {ex.Message}", ex);
            }
        }

        // Get article by ID
        public async Task<Articles> GetArticleById(string id)
        {
            try
            {
                var article = await _appDbContext.Articles
                    .Include(a => a.User)
                    .FirstOrDefaultAsync(a => a.id == id);

                return article;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving article by ID: {ex.Message}", ex);
            }
        }

        // Get articles by user ID
        public async Task<List<Articles>> GetArticlesByUserId(int userId)
        {
            try
            {
                return await _appDbContext.Articles
                    .Include(a => a.User)
                    .Where(a => a.published_by == userId)
                    .OrderByDescending(a => a.created_at)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving articles by user ID: {ex.Message}", ex);
            }
        }

        // Update an existing article
        public async Task<Articles> UpdateArticle(Articles articles)
        {
            try
            {
                var existingArticle = await _appDbContext.Articles
                    .FirstOrDefaultAsync(a => a.id == articles.id);

                if (existingArticle == null)
                {
                    throw new ArgumentException("Article not found");
                }

                existingArticle.title = articles.title;
                existingArticle.image = articles.image;
                existingArticle.content = articles.content;
                existingArticle.updated_at = DateTime.UtcNow;

                _appDbContext.Articles.Update(existingArticle);
                await _appDbContext.SaveChangesAsync();

                return existingArticle;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating article: {ex.Message}", ex);
            }
        }

        // Delete article by ID
        public async Task<bool> DeleteArticle(string id)
        {
            try
            {
                var article = await _appDbContext.Articles
                    .FirstOrDefaultAsync(a => a.id == id);

                if (article == null)
                {
                    return false; // Article not found
                }

                _appDbContext.Articles.Remove(article);
                await _appDbContext.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting article: {ex.Message}", ex);
            }
        }

        // Delete articles by user ID
        public async Task<int> DeleteArticlesByUserId(int userId)
        {
            try
            {
                var articles = await _appDbContext.Articles
                    .Where(a => a.published_by == userId)
                    .ToListAsync();

                if (!articles.Any())
                {
                    return 0; 
                }

                _appDbContext.Articles.RemoveRange(articles);
                await _appDbContext.SaveChangesAsync();

                return articles.Count;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting articles by user ID: {ex.Message}", ex);
            }
        }

        // Check if article exists
        public async Task<bool> ArticleExists(string id)
        {
            try
            {
                return await _appDbContext.Articles
                    .AnyAsync(a => a.id == id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error checking article existence: {ex.Message}", ex);
            }
        }

        // Get articles with pagination
        public async Task<(List<Articles> articles, int totalCount)> GetArticlesPaginated(int pageNumber, int pageSize)
        {
            try
            {
                var totalCount = await _appDbContext.Articles.CountAsync();

                var articles = await _appDbContext.Articles
                    .Include(a => a.User)
                    .OrderByDescending(a => a.created_at)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return (articles, totalCount);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving paginated articles: {ex.Message}", ex);
            }
        }
    }
}