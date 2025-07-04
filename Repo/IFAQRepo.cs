using BO.Models;

namespace Repo
{
    public interface IFAQRepo
    {
        Task<FAQ> Create(FAQ faq);
        Task<List<FAQ>> GetAll();
        Task<FAQ> GetById(int id);
        Task<List<FAQ>> GetByUserId(int userId);
        Task<FAQ> Update(FAQ faq);
        Task<bool> Delete(int id);
        Task<bool> ValidateUserExists(int userId);
    }
}