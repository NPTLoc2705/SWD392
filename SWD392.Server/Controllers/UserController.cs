using BO.Models;
using DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Services.Service;

namespace SWD392.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("GetUser")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetStudent()
        {
            var result = await _userService.GetUsers();

            return Ok(result);
        }

        
    }
}