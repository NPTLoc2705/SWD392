using BO.Models;
using DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Services.Service;
using BO.dtos.Request;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;
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
        [HttpPut("UpdateUser/{id}")]
        [Authorize(Roles = "Student,Consultant,Admin")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserRequest request)
        {
            try
            {
                var existingUser = await _userService.GetUserById(id);
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrWhiteSpace(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { success = false, message = "Invalid user authentication" });
                }

                if (existingUser.Id != userId)
                    return Forbid("You can only update your own account");

                if (request == null)
                {
                    return BadRequest(new { success = false, message = "Invalid request data" });
                }

                // Create a User object from the UserResponse and update it
                var userToUpdate = new User
                {
                    Id = existingUser.Id,
                    Name = request.Name,
                    Email = request.Email,
                    Phone = request.Phone,
                    Password = existingUser.Password, // Keep existing password
                };

                // Only update password if a new one is provided
                if (!string.IsNullOrWhiteSpace(request.Password))
                {
                    userToUpdate.Password = HashPassword(request.Password);
                }

                var result = await _userService.UpdateUser(userToUpdate);

                if (result == null)
                {
                    return NotFound(new { success = false, message = "User not found" });
                }

                return Ok(new { success = true, data = result, message = "User updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetUserById(int id)
        {
            try
            {

                var article = await _userService.GetUserById(id);

                if (article == null)
                    return NotFound(new { success = false, message = "User not found" });

                return Ok(new
                {
                    success = true,
                    data = article,
                    message = "User retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while retrieving User",
                    error = ex.Message
                });
            }
        }

        [HttpPut("BanUser/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> BanUserById(int id)
        {
            try
            {
                var existingUser = await _userService.GetUserById(id);
                if (existingUser == null)
                    return NotFound(new { success = false, message = "User not found" });

                var banned = await _userService.BanUserById(id);
                if (!banned)
                    return BadRequest(new { success = false, message = "Failed to ban user" });

                return Ok(new
                {
                    success = true,
                    message = "User banned successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while banning the user",
                    error = ex.Message
                });
            }
        }

        [HttpPut("UnbanUser/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UnbanUserById(int id)
        {
            try
            {
                var existingUser = await _userService.GetUserById(id);
                if (existingUser == null)
                    return NotFound(new { success = false, message = "User not found" });

                var banned = await _userService.UnbanUserById(id);
                if (!banned)
                    return BadRequest(new { success = false, message = "Failed to unban user" });

                return Ok(new
                {
                    success = true,
                    message = "User unbanned successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while unbanning the user",
                    error = ex.Message
                });
            }
        }
        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

    }
}