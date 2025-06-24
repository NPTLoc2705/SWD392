using BO.Models;

namespace Repo
{
    public interface IFAQRepo
    {
        Task<FAQ> CreateAsync(FAQ faq);
        Task<List<FAQ>> GetAllAsync();
        Task<FAQ> GetByIdAsync(int id);
        Task<List<FAQ>> GetByUserIdAsync(int userId);
        Task<FAQ> UpdateAsync(FAQ faq);
        Task<bool> DeleteAsync(int id);
        Task<bool> ValidateUserExistsAsync(int userId);
    }
}