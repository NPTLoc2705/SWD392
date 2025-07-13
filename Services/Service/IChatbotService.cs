using BO.dtos.Request;
using BO.dtos.Response;
using BO.Dtos.Response;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Services.Service
{
    public interface IChatbotService : IDisposable
    {
        Task<ChatbotResponse> GenerateResponse(ChatbotRequest request, int? userId);
        Task<List<ChatHistoryResponse>> GetChatHistory(int userId);
    }
}