using BO.Models;

namespace Repo
{
    public interface IFAQRepo
    {
        Task<FAQ> CreateAsync(FAQ faq);
        Task<List<FAQ>> GetAllAsync();
        Task<FAQ> GetByIdAsync(int id);
        Task<FAQ> UpdateAsync(FAQ faq);
        Task<bool> DeleteAsync(int id);
    }
}
