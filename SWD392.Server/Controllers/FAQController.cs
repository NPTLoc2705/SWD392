using BO.dtos.Request;
using BO.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Service;
using System.Security.Claims;

namespace SWD392.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FAQController : ControllerBase
    {
        private readonly IFAQService _faqService;

        public FAQController(IFAQService faqService)
        {
            _faqService = faqService;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateFAQ([FromBody] FAQRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();
                    return BadRequest(new
                    {
                        success = false,
                        message = "Validation failed",
                        errors = errors
                    });
                }

                // Get user ID from JWT token claims
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrWhiteSpace(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { success = false, message = "Invalid user authentication" });
                }

                var result = await _faqService.CreateFAQ(request, userId);
                return CreatedAtAction(
                    nameof(GetFAQById),
                    new { id = result.Id },
                    new
                    {
                        success = true,
                        data = result,
                        message = "FAQ created successfully"
                    });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while creating the FAQ",
                    error = ex.Message
                });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllFAQs()
        {
            try
            {
                var faqs = await _faqService.GetAllFAQs();
                return Ok(new
                {
                    success = true,
                    data = faqs,
                    message = "FAQs retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while retrieving FAQs",
                    error = ex.Message
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFAQById(int id)
        {
            try
            {
                var faq = await _faqService.GetById(id);
                if (faq == null)
                    return NotFound(new
                    {
                        success = false,
                        message = "FAQ not found"
                    });

                return Ok(new
                {
                    success = true,
                    data = faq,
                    message = "FAQ retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while retrieving the FAQ",
                    error = ex.Message
                });
            }
        }
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateFAQ(int id, [FromBody] FAQRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();
                    return BadRequest(new
                    {
                        success = false,
                        message = "Validation failed",
                        errors = errors
                    });
                }

                // Get user ID from JWT token claims
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrWhiteSpace(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { success = false, message = "Invalid user authentication" });
                }

                var updatedFaq = await _faqService.Update(id, request, userId);
                if (updatedFaq == null)
                    return NotFound(new
                    {
                        success = false,
                        message = "FAQ not found"
                    });

                return Ok(new
                {
                    success = true,
                    data = updatedFaq,
                    message = "FAQ updated successfully"
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while updating the FAQ",
                    error = ex.Message
                });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteFAQ(int id)
        {
            try
            {
                var result = await _faqService.DeleteFAQ(id);
                if (!result)
                    return NotFound(new
                    {
                        success = false,
                        message = "FAQ not found"
                    });

                return Ok(new
                {
                    success = true,
                    message = "FAQ deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while deleting the FAQ",
                    error = ex.Message
                });
            }
        }
    }
}