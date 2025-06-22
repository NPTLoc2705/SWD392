using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;

namespace Services.Service
{
    public interface IFAQService
    {
        Task<FAQResponse> CreateFAQAsync(FAQRequest request);
        Task<List<FAQResponse>> GetAllFAQsAsync();
        Task<FAQResponse> GetByIdAsync(int id);
        Task<FAQResponse> UpdateAsync(int id, FAQRequest request);
        Task<bool> DeleteFAQAsync(int id);
    }
}
