using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BO.dtos;
using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
namespace Repo
{
    public interface IAuthRepository
    {
        Task<Student> Register(RegisterRequest registerDto);
        Task<LoginResponse> Login(LoginRequest loginDto);       
        Task<LoginResponse> GoogleLogin(GoogleAuthDto googleAuthDto);
     
       
    }
}
