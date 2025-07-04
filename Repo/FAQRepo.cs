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

        public async Task<FAQ> Create(FAQ faq)
        {
            return await _faqDao.Create(faq);
        }

        public async Task<List<FAQ>> GetAll()
        {
            return await _faqDao.GetAll();
        }

        public async Task<FAQ> GetById(int id)
        {
            return await _faqDao.GetById(id);
        }

        public async Task<List<FAQ>> GetByUserId(int userId)
        {
            return await _faqDao.GetByUserId(userId);
        }

        public async Task<FAQ> Update(FAQ faq)
        {
            return await _faqDao.Update(faq);
        }

        public async Task<bool> Delete(int id)
        {
            return await _faqDao.Delete(id);
        }

        public async Task<bool> ValidateUserExists(int userId)
        {
            return await _faqDao.ValidateUserExists(userId);
        }
    }
}
