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

        private UserResponse MapToUserResponse(User user)
        {
            if (user == null)
                return null;

            return new UserResponse
            {
                Id = user.id,
                Name = user.name,
                Email = user.email,
                Phone = user.phone,
                RoleName = user.Role?.Name
            };
        }
    }
}
