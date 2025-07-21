using BO.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class FAQDAO
    {
        private readonly AppDbContext _context;

        public FAQDAO(AppDbContext context)
        {
            _context = context;
        }

        public async Task<FAQ> Create(FAQ faq)
        {
            await _context.FAQs.AddAsync(faq);
            await _context.SaveChangesAsync();
            return faq;
        }

        public async Task<List<FAQ>> GetAll()
        {
            return await _context.FAQs
                .Include(f => f.User)
                .ToListAsync();
        }

        public async Task<FAQ> GetById(int id)
        {
            return await _context.FAQs
                .Include(f => f.User)
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<List<FAQ>> GetByUserId(int userId)
        {
            return await _context.FAQs
                .Include(f => f.User)
                .Where(f => f.Userid == userId)
                .ToListAsync();
        }

        public async Task<FAQ> Update(FAQ faq)
        {
            var existingFaq = await _context.FAQs.FindAsync(faq.Id);
            existingFaq.Question = faq.Question;
            existingFaq.Answer = faq.Answer;
            existingFaq.Userid = faq.Userid;    

            await _context.SaveChangesAsync();
            return existingFaq;
        }

        public async Task<bool> Delete(int id)
        {
            var faq = await _context.FAQs.FindAsync(id);
            if (faq == null) return false;

            _context.FAQs.Remove(faq);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ValidateUserExists(int userId)
        {
            return await _context.User.AnyAsync(u => u.Id == userId);
        }
    }
}