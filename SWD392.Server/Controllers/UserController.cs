using BO.Models;
using DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace SWD392.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Student")] // Add authorization requirement
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public UserController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpGet("GetUser")]
        public async Task<IActionResult> GetStudent()
        {
            var result = await _appDbContext.Student.Select(x => new User
            {
                id = x.id,
                name = x.name,
                email = x.email,
                phone = x.phone,
                Role = x.Role
                // password is excluded due to JsonIgnore
            }).ToListAsync();

            return Ok(result);
        }

        // The old CreateStudent method is now handled by the AuthController's Register method
    }
}