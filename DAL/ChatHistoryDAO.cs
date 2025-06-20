using BO.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DAL
{
    public class ChatHistoryDAO
    {
        private readonly AppDbContext _context;

        public ChatHistoryDAO(AppDbContext context)
        {
            _context = context;
        }

        public async Task SaveChatMessage(ChatHistory chat)
        {
            _context.ChatHistories.Add(chat);
            await _context.SaveChangesAsync();
        }

        public async Task<List<ChatHistory>> GetChatHistoryByUserId(int userId)
        {
            return await _context.ChatHistories
                .Where(ch => ch.UserId == userId)
                .OrderByDescending(ch => ch.Timestamp)
                .ToListAsync();
        }
    }
}