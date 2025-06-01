using BO.dtos;
using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
using DAL;
using Microsoft.Extensions.Configuration;


namespace Repo
{
    public class AuthRepository : IAuthRepository
    {
      private readonly AuthDAO AuthDAO;
        public AuthRepository(AppDbContext context, IConfiguration configuration)
        {
            AuthDAO = new AuthDAO(context, configuration);
        }

        public Task<LoginResponse> GoogleLogin(GoogleAuthDto googleAuthDto)
        => AuthDAO.GoogleLogin(googleAuthDto);
        public Task<LoginResponse> Login(LoginRequest loginDto)
        => AuthDAO.Login(loginDto);

        public Task<User> Register(RegisterRequest registerDto)
        => AuthDAO.Register(registerDto);
    }
}
