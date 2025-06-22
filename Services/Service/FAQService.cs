using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
using DAL;
using Repo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Service
{
    public class FAQService : IFAQService
    {
        private readonly IFAQRepo _faqRepo;

        public FAQService(IFAQRepo faqRepo)
        {
            _faqRepo = faqRepo;
        }

        public async Task<FAQResponse> CreateFAQAsync(FAQRequest request)
        {
            var faq = new FAQ
            {
                Question = request.Question,
                Answer = request.Answer
            };

            var result = await _faqRepo.CreateAsync(faq);
            return MapToResponse(result);
        }

        public async Task<List<FAQResponse>> GetAllFAQsAsync()
        {
            var faqs = await _faqRepo.GetAllAsync();
            return faqs.Select(MapToResponse).ToList();
        }

        public async Task<FAQResponse> GetByIdAsync(int id)
        {
            var faq = await _faqRepo.GetByIdAsync(id);
            return MapToResponse(faq);
        }

        public async Task<FAQResponse> UpdateAsync(int id, FAQRequest request)
        {
            var faq = new FAQ
            {
                Id = id,
                Question = request.Question,
                Answer = request.Answer
            };

            var result = await _faqRepo.UpdateAsync(faq);
            return MapToResponse(result);
        }

        public async Task<bool> DeleteFAQAsync(int id)
        {
            return await _faqRepo.DeleteAsync(id);
        }

        private static FAQResponse MapToResponse(FAQ faq)
        {
            if (faq == null) return null;

            return new FAQResponse
            {
                Id = faq.Id,
                Question = faq.Question,
                Answer = faq.Answer
            };
        }
    }
}
