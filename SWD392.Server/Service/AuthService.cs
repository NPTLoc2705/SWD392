using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using SWD392.Server.Models;
using System.Security.Cryptography;

namespace SWD392.Server.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<Student> Register(RegisterDto registerDto)
        {
            // Check if user already exists
            if (await _context.Student.AnyAsync(s => s.email == registerDto.email))
            {
                throw new Exception("Email already registered");
            }

            // Create new student
            var student = new Student
            {
                name = registerDto.name,
                email = registerDto.email,
                phone = registerDto.phone,
                password = HashPassword(registerDto.password)
            };

            _context.Student.Add(student);
            await _context.SaveChangesAsync();

            return student;
        }

        public async Task<LoginResponse> Login(LoginDto loginDto)
        {
            var student = await _context.Student
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

        private string GenerateJwtToken(Student student)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["JwtSettings:SecretKey"]));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, student.id.ToString()),
                new Claim(ClaimTypes.Email, student.email),
                new Claim(ClaimTypes.Name, student.name)
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