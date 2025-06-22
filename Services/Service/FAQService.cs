using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Service
{
    public class FAQService : IFAQService
    {
        private readonly FAQDAO _faqDAO;

        public FAQService(FAQDAO faqDAO)
        {
            _faqDAO = faqDAO;
        }

        public async Task<FAQResponse> CreateFAQAsync(FAQRequest request)
        {
            var faq = new FAQ
            {
                Question = request.Question,
                Answer = request.Answer
            };

            var createdFaq = await _faqDAO.CreateAsync(faq);

            return MapToResponse(createdFaq);
        }

        public async Task<List<FAQResponse>> GetAllFAQsAsync()
        {
            var faqs = await _faqDAO.GetAllAsync();
            return faqs.Select(MapToResponse).ToList();
        }

        public async Task<FAQResponse> GetByIdAsync(int id)
        {
            var faq = await _faqDAO.GetByIdAsync(id);
            if (faq == null) return null;

            return MapToResponse(faq);
        }
        public async Task<FAQ> UpdateAsync(int id, FAQRequest request)
        {
            var faq = new FAQ
            {
                Id = id,
                Question = request.Question,
                Answer = request.Answer
            };

            return await _faqDAO.UpdateAsync(faq);
        }

        public async Task<bool> DeleteFAQAsync(int id)
        {
            return await _faqDAO.DeleteAsync(id);
        }

        private static FAQResponse MapToResponse(FAQ faq)
        {
            return new FAQResponse
            {
                Id = faq.Id,
                Question = faq.Question,
                Answer = faq.Answer
            };
        }
    }
}
