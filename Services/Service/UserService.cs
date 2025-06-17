using BO.dtos.Response;
using BO.Models;
using Repo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepo _userRepo;
        public UserService(IUserRepo userRepo)
        {
            _userRepo = userRepo ?? throw new ArgumentNullException(nameof(userRepo));
        }

        public async Task<UserResponse> GetUserById(int id)
        {
            var user = await _userRepo.GetUserById(id);
            return MapToUserResponse(user);
        }

        public  async Task<List<UserResponse>> GetUsers()
        {
            try
            {
                var user = await _userRepo.ViewUser();
                return user.Select(MapToUserResponse).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error while list user in Service:" + ex.Message, ex);
            }
        }

        public async Task<UserResponse> UpdateUser(User user)
        {
            var existinguser = await _userRepo.UpdateUser(user);
            return MapToUserResponse(existinguser);
        }
        public async Task<bool>DeleteUserById(int id)
        {
            return await _userRepo.DeleteUserById(id);
        }

        private UserResponse MapToUserResponse(User user)
        {
            if (user == null)
                return null;

            return new UserResponse
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                RoleName = user.Role?.Name
            };
        }
    }
}
