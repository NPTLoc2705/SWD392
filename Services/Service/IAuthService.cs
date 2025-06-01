using BO.dtos;
using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Service
{
    public interface IAuthService
    {
        Task<Student> Register(RegisterRequest registerDto);
        Task<LoginResponse> Login(LoginRequest loginDto);
        Task<LoginResponse> GoogleLogin(GoogleAuthDto googleAuthDto);
    }
}
