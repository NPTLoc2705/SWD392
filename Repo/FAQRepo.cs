using BO.Models;
using DAL;

namespace Repo
{
    public class FAQRepo : IFAQRepo
    {
        private readonly FAQDAO _faqDao;

        public FAQRepo(FAQDAO faqDao)
        {
            _faqDao = faqDao;
        }

        public async Task<FAQ> CreateAsync(FAQ faq)
        {
            return await _faqDao.CreateAsync(faq);
        }

        public async Task<List<FAQ>> GetAllAsync()
        {
            return await _faqDao.GetAllAsync();
        }

        public async Task<FAQ> GetByIdAsync(int id)
        {
            return await _faqDao.GetByIdAsync(id);
        }

        public async Task<List<FAQ>> GetByUserIdAsync(int userId)
        {
            return await _faqDao.GetByUserIdAsync(userId);
        }

        public async Task<FAQ> UpdateAsync(FAQ faq)
        {
            return await _faqDao.UpdateAsync(faq);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _faqDao.DeleteAsync(id);
        }

        public async Task<bool> ValidateUserExistsAsync(int userId)
        {
            return await _faqDao.ValidateUserExistsAsync(userId);
        }
    }
}
