using BO.dtos.Request;
using BO.Dtos.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Service;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SWD392.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatbotController : ControllerBase
    {
        private readonly IChatbotService _chatbotService;

        public ChatbotController(IChatbotService chatbotService)
        {
            _chatbotService = chatbotService ?? throw new ArgumentNullException(nameof(chatbotService));
        }

        [HttpPost]
        // No [Authorize] to allow guest access
        public async Task<IActionResult> Chat([FromBody] ChatbotRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid request" });

                int? userId = null;
                if (User.Identity.IsAuthenticated)
                {
                    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    if (!int.TryParse(userIdClaim, out int parsedUserId))
                        return Unauthorized(new { success = false, message = "Invalid user authentication" });
                    userId = parsedUserId;
                }

                var response = await _chatbotService.GenerateResponse(request, userId);
                return Ok(new { success = true, data = response, message = "Response generated" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Server error", error = ex.Message });
            }
        }

        [HttpGet("history")]
        [Authorize] // Restricted to authenticated users
        public async Task<IActionResult> GetChatHistory()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!int.TryParse(userIdClaim, out int userId))
                    return Unauthorized(new { success = false, message = "Invalid user authentication" });

                var history = await _chatbotService.GetChatHistory(userId);
                return Ok(new { success = true, data = history, message = "Chat history retrieved" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Server error", error = ex.Message });
            }
        }
    }
}