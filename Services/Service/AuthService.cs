using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using BO.dtos.Response;
using BO.dtos;
using BO.dtos.Request;
using BO.Models;
using Repo;

namespace Services.Service
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _configuration;

        // Use dependency injection instead of direct instantiation
        public AuthService(IAuthRepository authRepository, IConfiguration configuration)
        {
            _authRepository = authRepository ?? throw new ArgumentNullException(nameof(authRepository));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public Task<LoginResponse> GoogleLogin(GoogleAuthDto googleAuthDto)
        {
            if (googleAuthDto == null)
                throw new ArgumentNullException(nameof(googleAuthDto));

            return _authRepository.GoogleLogin(googleAuthDto);
        }

        public Task<LoginResponse> Login(LoginRequest loginDto)
        {
            if (loginDto == null)
                throw new ArgumentNullException(nameof(loginDto));

            return _authRepository.Login(loginDto);
        }

        public Task<User> Register(RegisterRequest registerDto)
        {
            if (registerDto == null)
                throw new ArgumentNullException(nameof(registerDto));

            return _authRepository.Register(registerDto);
        }
    }
}