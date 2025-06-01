using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using BO.Models;
using BO.dtos.Request;
using BO.dtos.Response;
using BO.dtos;

namespace DAL
{
    public class AuthDAO
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthDAO(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<User> Register(RegisterRequest registerDto)
        {
            // Check if user already exists
            if (await _context.Student.AnyAsync(s => s.email == registerDto.email))
            {
                throw new Exception("Email already registered");
            }

            // Create new student
            var student = new User
            {
                name = registerDto.name,
                email = registerDto.email,
                phone = registerDto.phone,
                password = HashPassword(registerDto.password),
                RoleId = 1
            };

            _context.Student.Add(student);
            await _context.SaveChangesAsync();

            return student;
        }

        public async Task<LoginResponse> Login(LoginRequest loginDto)
        {
            // Include the Role navigation property
            var student = await _context.Student
                .Include(s => s.Role)
                .FirstOrDefaultAsync(s => s.email == loginDto.email);

            if (student == null || !VerifyPassword(loginDto.password, student.password))
            {
                throw new Exception("Invalid email or password");
            }

            var token = GenerateJwtToken(student);

            return new LoginResponse
            {
                token = token,
                user = student
            };
        }

        public async Task<LoginResponse> GoogleLogin(GoogleAuthDto googleAuthDto)
        {
            try
            {
                // Verify Google ID token
                var payload = await GoogleJsonWebSignature.ValidateAsync(
                    googleAuthDto.IdToken,
                    new GoogleJsonWebSignature.ValidationSettings()
                    {
                        Audience = new[] { _configuration["GoogleAuth:ClientId"] }
                    });

                // Include the Role navigation property
                var student = await _context.Student
                    .Include(s => s.Role)
                    .FirstOrDefaultAsync(s => s.email == payload.Email);

                if (student == null)
                {
                    student = new User
                    {
                        name = payload.Name,
                        email = payload.Email,
                        phone = "",
                        password = "",
                        RoleId = 1 // Set default role for Google users
                    };

                    _context.Student.Add(student);
                    await _context.SaveChangesAsync();

                    // Load the role for the newly created user
                    student = await _context.Student
                        .Include(s => s.Role)
                        .FirstOrDefaultAsync(s => s.id == student.id);
                }

                var token = GenerateJwtToken(student);

                return new LoginResponse
                {
                    token = token,
                    user = student
                };
            }
            catch (Exception)
            {
                throw new Exception("Invalid Google token");
            }
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.id.ToString()),
                new Claim(ClaimTypes.Email, user.email),
                new Claim(ClaimTypes.Name, user.name),
                new Claim(ClaimTypes.Role, user.Role?.Name ?? "User") // Safe access with null coalescing
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string HashPassword(string password)
        {
            // Use BCrypt or another secure password hashing algorithm in production
            // For simplicity, we'll use a basic hash function here
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        private bool VerifyPassword(string password, string hashedPassword)
        {
            // Match with the same hashing algorithm used above
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes) == hashedPassword;
            }
        }
    }
}