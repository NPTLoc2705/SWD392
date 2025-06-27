using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Files
{
    public interface IFileService
    {
        Task<string> SaveFileAsync(IFormFile file);
        Task DeleteFileAsync(string filePath);
        Task<(string fullUrl, string relativePath)> SaveFileWithPathsAsync(IFormFile file);
    }

}
