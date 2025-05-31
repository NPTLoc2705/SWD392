using BO.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SWD392.Server.Models;

namespace SWD392.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Add authorization requirement
    public class StudentController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public StudentController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpGet("GetStudent")]
        public async Task<IActionResult> GetStudent()
        {
            var result = await _appDbContext.Student.Select(x => new Student
            {
                id = x.id,
                name = x.name,
                email = x.email,
                phone = x.phone,
                // password is excluded due to JsonIgnore
            }).ToListAsync();

            return Ok(result);
        }

        // The old CreateStudent method is now handled by the AuthController's Register method
    }
}