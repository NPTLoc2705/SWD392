﻿using BO.Models;
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

        public Task<User> GetUserById(int id)
        {
            return _userDAO.GetUserById(id);
        }

        public Task<User> UpdateUser(User user)
        {
            return _userDAO.UpdateUser(user);
        }

        public async Task<List<User>> ViewUser()
        {
            try
            {
                return await _userDAO.ViewUser();
            }
            catch (Exception ex)
            {
                throw new Exception("Error while list user in Repo: " + ex.Message);
            }
        }
        public async Task<bool> BanUserById(int id)
        {
            try
            {
                return await _userDAO.BanUserById(id);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> UnbanUserById(int id)
        {
            try
            {
                return await _userDAO.UnbanUserById(id);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
