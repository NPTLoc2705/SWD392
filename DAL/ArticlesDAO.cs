using BO.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DAL
{
    public class ArticlesDAO
    {
        private readonly AppDbContext _appDbContext;
        private readonly string _imageStoragePath;

        public ArticlesDAO(AppDbContext context, string imageStoragePath = "wwwroot/images/articles")
        {
            _appDbContext = context;
            _imageStoragePath = imageStoragePath;
        }

        // Upload/Create a new article
        public async Task<Articles> Upload(Articles articles, byte[] imageData = null)
        {
            try
            {
                string imagePath = null;
                if (imageData != null && imageData.Length > 0)
                {
                    // Ensure directory exists
                    if (!Directory.Exists(_imageStoragePath))
                    {
                        Directory.CreateDirectory(_imageStoragePath);
                    }

                    // Generate unique file name
                    var fileName = $"{Guid.NewGuid().ToString("N")}.jpg"; // Assuming JPEG format
                    var fullPath = Path.Combine(_imageStoragePath, fileName);

                    // Save image to file system
                    await File.WriteAllBytesAsync(fullPath, imageData);
                    imagePath = $"/images/articles/{fileName}";
                }

                var article = new Articles
                {
                    title = articles.title,
                    imagePath = imagePath ?? articles.imagePath,
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

        // Get all>>>>>>>all articles
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
        public async Task<Articles> UpdateArticle(Articles articles, byte[] imageData = null)
        {
            try
            {
                var existingArticle = await _appDbContext.Articles
                    .FirstOrDefaultAsync(a => a.id == articles.id);

                if (existingArticle == null)
                {
                    throw new ArgumentException("Article not found");
                }

                string imagePath = existingArticle.imagePath;
                if (imageData != null && imageData.Length > 0)
                {
                    // Delete old image if exists
                    if (!string.IsNullOrEmpty(imagePath))
                    {
                        var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", imagePath.TrimStart('/'));
                        if (File.Exists(oldImagePath))
                        {
                            File.Delete(oldImagePath);
                        }
                    }

                    // Save new image
                    if (!Directory.Exists(_imageStoragePath))
                    {
                        Directory.CreateDirectory(_imageStoragePath);
                    }

                    var fileName = $"{Guid.NewGuid().ToString("N")}.jpg";
                    var fullPath = Path.Combine(_imageStoragePath, fileName);
                    await File.WriteAllBytesAsync(fullPath, imageData);
                    imagePath = $"/images/articles/{fileName}";
                }

                existingArticle.title = articles.title;
                existingArticle.imagePath = imagePath;
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

                // Delete image file
                if (!string.IsNullOrEmpty(article.imagePath))
                {
                    var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", article.imagePath.TrimStart('/'));
                    if (File.Exists(imagePath))
                    {
                        File.Delete(imagePath);
                    }
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

                foreach (var article in articles)
                {
                    // Delete image file
                    if (!string.IsNullOrEmpty(article.imagePath))
                    {
                        var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", article.imagePath.TrimStart('/'));
                        if (File.Exists(imagePath))
                        {
                            File.Delete(imagePath);
                        }
                    }
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