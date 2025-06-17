using BO.Models;
using BO.dtos.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Service
{
    public interface IUserService
    {
        Task<List<UserResponse>> GetUsers();
        Task<UserResponse> UpdateUser(User user);
        Task<UserResponse> GetUserById(int id);
        Task<bool> DeleteUserById(int id);
    }
}
