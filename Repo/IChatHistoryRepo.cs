using BO.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repo
{
    public interface IChatHistoryRepo
    {
        Task SaveChatMessage(int userId, string message, string response);
        Task<List<ChatHistory>> GetChatHistoryByUserId(int userId);
    }
}