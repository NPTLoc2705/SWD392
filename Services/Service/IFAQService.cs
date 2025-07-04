using BO.dtos.Request;
using BO.dtos.Response;

namespace Services.Service
{
    public interface IFAQService
    {
        Task<FAQResponse> CreateFAQ(FAQRequest request, int userId);
        Task<List<FAQResponse>> GetAllFAQs();
        Task<FAQResponse> GetById(int id);
        Task<List<FAQResponse>> GetByUserId(int userId);
        Task<FAQResponse> Update(int id, FAQRequest request, int userId);
        Task<bool> DeleteFAQ(int id);
    }
}