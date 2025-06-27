using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BO.dtos.Request;
using BO.dtos.Response;
using DAL;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using BO.Models;
using Services.Ticket;

namespace SWD392.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedBackService _feedbackService;
        private readonly AppDbContext _context;

        public FeedbackController(IFeedBackService feedbackService, AppDbContext context)
        {
            _feedbackService = feedbackService;
            _context = context;
        }

        [HttpPost("{ticketId}")] // Get ticketId from URL
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> SubmitFeedback(
    string ticketId, // From route
    [FromBody] FeedbackRatingRequest request) // Only needs rating/comment
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int studentId))
                {
                    return Unauthorized("Invalid user identity");
                }

                var ticket = await _context.Tickets
                    .FirstOrDefaultAsync(t => t.Id == ticketId &&
                                           t.StudentId == studentId &&
                                           t.Status == Status.Answered);

                if (ticket == null)
                    return BadRequest("Ticket not found/not completed");

                if (await _context.Feedback.AnyAsync(f => f.ticket_id == ticketId))
                    return BadRequest("Feedback already exists");

                var feedback = await _feedbackService.SubmitFeedbackAsync(ticketId, request, studentId);

                return Ok(feedback);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error submitting feedback");
            }
        }

        [HttpGet("{feedbackId}")]
        public async Task<IActionResult> GetFeedback(string feedbackId)
        {
            try
            {
                var feedback = await _feedbackService.GetFeedbackAsync(feedbackId);
                if (feedback == null)
                {
                    return NotFound(new { Message = "Feedback not found" });
                }

                // Authorization check
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

                // Students can only view their own feedback
                if (userRole == "Student")
                {
                    var studentFeedback = await _context.Feedback
                        .AnyAsync(f => f.id == feedbackId && f.student_id == userId);
                    if (!studentFeedback)
                    {
                        return Forbid();
                    }
                }
                // Consultants can only view feedback about them
                else if (userRole == "Consultant")
                {
                    var consultantFeedback = await _context.Feedback
                        .AnyAsync(f => f.id == feedbackId && f.consultant_id == userId);
                    if (!consultantFeedback)
                    {
                        return Forbid();
                    }
                }

                return Ok(feedback);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred", Error = ex.Message });
            }
        }

        [HttpGet("consultant/{consultantId}")]
        public async Task<IActionResult> GetConsultantFeedbacks(int consultantId)
        {
            try
            {
                var feedbacks = await _feedbackService.GetConsultantFeedbacksAsync(consultantId);
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred", Error = ex.Message });
            }
        }
        [HttpPut("{feedbackId}/response")]
        [Authorize(Roles = "Consultant")]
        public async Task<IActionResult> RespondToFeedback(string feedbackId, [FromBody] FeedbackResponseRequest request)
        {
            try
            {
                // Validate request
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        Message = "Invalid request data",
                        Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                    });
                }

                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int consultantId))
                {
                    return Unauthorized("Invalid user identity");
                }

                var feedback = await _feedbackService.RespondToFeedbackAsync(feedbackId, request.response, consultantId);

                if (feedback == null)
                {
                    return NotFound(new { Message = "Feedback not found" });
                }

                return Ok(new
                {
                    success = true,
                    message = "Response submitted successfully",
                    data = feedback
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                // Log the exception here
                return StatusCode(500, new { Message = "An error occurred while processing your request", Error = ex.Message });
            }
        }
    }
}