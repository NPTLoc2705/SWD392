using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace DAL.Files
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _env;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public FileService(IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor)
        {
            _env = env;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<string> SaveFileAsync(IFormFile file)
        {
            Console.WriteLine($"SaveFileAsync called with file: {file?.FileName}, Length: {file?.Length}");
            if (file == null || file.Length == 0)
            {
                Console.WriteLine("File is null or empty, returning null");
                return null;
            }
            try
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                    Console.WriteLine("Created uploads directory");
                }
                var safeFileName = GetSafeFileName(file.FileName);
                var uniqueFileName = $"{Guid.NewGuid()}_{safeFileName}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                Console.WriteLine($"Saving file to: {filePath}");
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var relativePath = $"/uploads/{uniqueFileName}";
                Console.WriteLine($"File saved successfully, returning: {relativePath}");
                return relativePath;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving file: {ex.Message}");
                throw new Exception("Failed to save file", ex);
            }
        }

        public async Task DeleteFileAsync(string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
                return;

            try
            {
                // Handle both full URLs and relative paths
                var relativePath = filePath.StartsWith("http")
                    ? new Uri(filePath).AbsolutePath
                    : filePath;

                var fullPath = Path.Combine(_env.WebRootPath, relativePath.TrimStart('/'));
                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to delete file", ex);
            }
        }

        public async Task<(string fullUrl, string relativePath)> SaveFileWithPathsAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return (null, null);

            try
            {
                var relativePath = await SaveFileAsync(file);
                if (string.IsNullOrEmpty(relativePath))
                    return (null, null);

                var request = _httpContextAccessor.HttpContext.Request;
                var fullUrl = $"{request.Scheme}://{request.Host}{relativePath}";

                return (fullUrl, relativePath);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to save file with paths", ex);
            }
        }

        private string GetSafeFileName(string fileName)
        {
            return Path.GetInvalidFileNameChars()
                .Aggregate(fileName, (current, c) => current.Replace(c.ToString(), ""));
        }
    }
}