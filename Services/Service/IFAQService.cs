using BO.dtos.Request;
using BO.dtos.Response;

namespace Services.Service
{
    public interface IFAQService
    {
        Task<FAQResponse> CreateFAQAsync(FAQRequest request, int userId);
        Task<List<FAQResponse>> GetAllFAQsAsync();
        Task<FAQResponse> GetByIdAsync(int id);
        Task<List<FAQResponse>> GetByUserIdAsync(int userId);
        Task<FAQResponse> UpdateAsync(int id, FAQRequest request, int userId);
        Task<bool> DeleteFAQAsync(int id);
    }
}