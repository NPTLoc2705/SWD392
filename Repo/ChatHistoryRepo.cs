using BO.Models;
using DAL;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repo
{
    public class ChatHistoryRepo : IChatHistoryRepo
    {
        private readonly ChatHistoryDAO _dao;

        public ChatHistoryRepo(ChatHistoryDAO dao)
        {
            _dao = dao;
        }

        public async Task SaveChatMessageAsync(int userId, string message, string response)
        {
            if (userId <= 0) throw new ArgumentException("Invalid user ID");
            if (string.IsNullOrWhiteSpace(message)) throw new ArgumentException("Message cannot be empty");
            if (string.IsNullOrWhiteSpace(response)) throw new ArgumentException("Response cannot be empty");

            var chat = new ChatHistory
            {
                UserId = userId,
                Message = message,
                Response = response,
                Timestamp = DateTime.UtcNow
            };
            await _dao.SaveChatMessageAsync(chat);
        }

        public async Task<List<ChatHistory>> GetChatHistoryByUserIdAsync(int userId)
        {
            if (userId <= 0) throw new ArgumentException("Invalid user ID");
            return await _dao.GetChatHistoryByUserIdAsync(userId);
        }
    }
}