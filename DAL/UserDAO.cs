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
        public UserDAO(AppDbContext context)
        {
            _dbContext = context;
        }
        public async Task<List<User>> ViewUser()
        {
            try
            {
                return await _dbContext.User
                    .Include(a => a.Role) //This fucking line added the role when fetch
                    .OrderByDescending(a => a.Name)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving User from UserDAO: {ex.Message}", ex);
            }

        }
        public async Task<User> UpdateUser(User user)
        {
            try
            {
                var existingUser = await _dbContext.User.FirstOrDefaultAsync(u => u.Id == user.Id);
                if (existingUser == null)
                {
                    throw new ArgumentException("User not found");
                }
                existingUser.Name = user.Name;
                existingUser.Email = user.Email;
                existingUser.Phone = user.Phone;
                if (user.Password != null)
                {
                    existingUser.Password = user.Password;
                }
                else
                {
                    existingUser.Password = existingUser.Password;
                }

                _dbContext.User.Update(existingUser);
                await _dbContext.SaveChangesAsync();
                return existingUser;

            }
            catch (Exception e)
            {
                throw new Exception($"Error updating User: {e.Message}");
            }
        }
        public async Task<User>GetUserById(int id)
        {
            var user = await _dbContext.User.FirstOrDefaultAsync(a => a.Id == id);
            return user;
        }
        public async Task<bool> BanUserById(int id)
        {
            try
            {
                var user = await _dbContext.User.FirstOrDefaultAsync(a => a.Id == id);
                if (user == null)
                {
                    return false;
                }
                user.IsBanned = true;
                _dbContext.User.Update(user);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                throw new Exception($"Cannot ban user: {e.Message}");
            }
        }
        public async Task<bool>UnbanUserById(int id)
        {
            try
            {
                var user = await _dbContext.User.FirstOrDefaultAsync(a => a.Id == id);
                if (user == null)
                {
                    return false;
                }
                user.IsBanned = false;
                _dbContext.User.Update(user);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                throw new Exception($"Cannot ban user: {e.Message}");
            }
        }
    }
}