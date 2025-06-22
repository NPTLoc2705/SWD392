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

        public async Task<FAQ> CreateAsync(FAQ faq)
        {
            await _context.FAQs.AddAsync(faq);
            await _context.SaveChangesAsync();
            return faq;
        }

        public async Task<List<FAQ>> GetAllAsync()
        {
            return await _context.FAQs.ToListAsync();
        }

        public async Task<FAQ> GetByIdAsync(int id)
        {
            return await _context.FAQs.FindAsync(id);
        }
        public async Task<FAQ> UpdateAsync(FAQ faq)
        {
            var existingFaq = await _context.FAQs.FindAsync(faq.Id);
            if (existingFaq == null) return null;

            existingFaq.Question = faq.Question;
            existingFaq.Answer = faq.Answer;

            await _context.SaveChangesAsync();
            return existingFaq;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var faq = await _context.FAQs.FindAsync(id);
            if (faq == null) return false;

            _context.FAQs.Remove(faq);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
