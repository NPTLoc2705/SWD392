using BO.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repo
{
    public interface IChatHistoryRepo
    {
        Task SaveChatMessageAsync(int userId, string message, string response);
        Task<List<ChatHistory>> GetChatHistoryByUserIdAsync(int userId);
    }
}