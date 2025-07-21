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

        public async Task<FAQResponse> CreateFAQ(FAQRequest request, int userId)
        {
           

            var faq = new FAQ
            {
                Question = request.Question,
                Answer = request.Answer,
                Userid = userId
            };
            var result = await _faqRepo.Create(faq);
            if (result == null)
            {
                return null; // Indicate creation failure
            }
            return MapToResponse(result);
        }

        public async Task<List<FAQResponse>> GetAllFAQs()
        {
            var faqs = await _faqRepo.GetAll();
            return faqs.Select(MapToResponse).ToList();
        }

        public async Task<FAQResponse> GetById(int id)
        {
            var faq = await _faqRepo.GetById(id);
            return MapToResponse(faq);
        }

        public async Task<List<FAQResponse>> GetByUserId(int userId)
        {
            var faqs = await _faqRepo.GetByUserId(userId);
            return faqs.Select(MapToResponse).ToList();
        }


        public async Task<FAQResponse> Update(int id, FAQRequest request, int userId)
        {
            var existingFaq = await _faqRepo.GetById(id);
            if (existingFaq == null)
                return null;

            var faq = new FAQ
            {
                Id = id,
                Question = request.Question,
                Answer = request.Answer,
                Userid = userId
            };

            var result = await _faqRepo.Update(faq);
            return MapToResponse(result);
        }

        public async Task<bool> DeleteFAQ(int id)
        {
            return await _faqRepo.Delete(id);
        }

        private static FAQResponse MapToResponse(FAQ faq)
        {
            if (faq == null) return null;

            return new FAQResponse
            {
                Id = faq.Id,
                Question = faq.Question,
                Answer = faq.Answer,
                UserId = faq.Userid,
                UserName = faq.User?.Name ?? faq.User?.Name ?? "Unknown"
            };
        }
    }
}