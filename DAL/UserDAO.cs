using BO.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class UserDAO
    {
        private readonly AppDbContext _dbContext;
        public UserDAO(AppDbContext context) {
            _dbContext = context;
        }
        public async Task<List<User>>  ViewUser()
        {
            try
            {
                return await _dbContext.Student
                    .Include(a => a.Role) //This fucking line added the role when fetch
                    .OrderByDescending(a => a.name)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving User from UserDAO: {ex.Message}", ex);
            }

        }
    }
}
