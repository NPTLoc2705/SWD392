using BO.Models;
using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repo
{
    public class UserRepo : IUserRepo
    {
        private readonly UserDAO _userDAO;
        public UserRepo(UserDAO userDAO)
        {
            _userDAO = userDAO;
        }
        public async Task<List<User>> ViewUser()
        {
            try
            {
                return await _userDAO.ViewUser();
            }
            catch (Exception ex)
            {
                throw new Exception("Error while list user in Repo: " +  ex.Message);
            }
        }
    }
}
