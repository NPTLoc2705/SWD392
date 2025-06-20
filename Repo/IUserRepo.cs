using BO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repo
{
    public interface IUserRepo
    {
        Task<List<User>> ViewUser();
        Task<User>UpdateUser(User user);
        Task<User> GetUserById(int id);
        Task<bool> BanUserById(int id);
    }
}
