using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BO.dtos.Request;
using BO.dtos.Response;
using Services.Ticket;
using System.Security.Claims;
using BO.Models;

namespace SWD392.Server.Controllers
{
    [ApiController]
    [Route("api/application")]
    [Authorize]
    public class ApplicationController : ControllerBase
    {
        private readonly IApplicationService _applicationService;
        private readonly ILogger<ApplicationController> _logger;

        public ApplicationController(
            IApplicationService applicationService,
            ILogger<ApplicationController> logger)
        {
            _applicationService = applicationService;
            _logger = logger;
        }

        /// <summary>
        /// Create a new application draft
        /// </summary>
        [HttpPost("draft")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<ApplicationResponse>> CreateDraft([FromForm] ApplicationRequest request)
        {
            try
            {
                var studentId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                var response = await _applicationService.CreateDraftAsync(studentId, request);
                return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating application draft");
                return StatusCode(500, new { message = "An error occurred while creating the application draft" });
            }
        }

        /// <summary>
        /// Submit a draft application
        /// </summary>
        [HttpPost("{id}/submit")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> SubmitApplication(string id)
        {
            try
            {
                var studentId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

                // Verify ownership first before submitting
                var application = await _applicationService.GetByIdAsync(id);
                if (application?.StudentId != studentId)
                {
                    return Forbid();
                }

                var response = await _applicationService.SubmitApplicationAsync(id);
                return Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error submitting application {id}");
                return StatusCode(500, new { message = "An error occurred while submitting the application" });
            }
        }

        /// <summary>
        /// Get application by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApplicationResponse>> GetById(string id)
        {
            try
            {
                var response = await _applicationService.GetByIdAsync(id);
                if (response == null)
                {
                    return NotFound(new { message = "Application not found" });
                }

                // Students can only view their own applications
                if (User.IsInRole("Student") &&
                    response.StudentId != int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)))
                {
                    return Forbid();
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving application {id}");
                return StatusCode(500, new { message = "An error occurred while retrieving the application" });
            }
        }

        /// <summary>
        /// Get all applications for current student
        /// </summary>
        [HttpGet("my-applications")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<List<ApplicationResponse>>> GetMyApplications()
        {
            try
            {
                var studentId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                return Ok(await _applicationService.GetByStudentAsync(studentId));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving applications for student {User.FindFirstValue(ClaimTypes.NameIdentifier)}");
                return StatusCode(500, new { message = "An error occurred while retrieving applications" });
            }
        }

        /// <summary>
        /// Update application details
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> UpdateApplication(string id, [FromForm] UpdateApplicationRequest request)
        {
            try
            {
                var studentId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

                // Verify ownership
                var existingApp = await _applicationService.GetByIdAsync(id);
                if (existingApp?.StudentId != studentId)
                {
                    return Forbid();
                }

                var response = await _applicationService.UpdateAsync(id, request);
                return Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating application {id}");
                return StatusCode(500, new { message = "An error occurred while updating the application" });
            }
        }
        

        /// <summary>
        /// Change application status (Admin only)
        /// </summary>
        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin, Consultant")]
        public async Task<IActionResult> ChangeStatus(string id, [FromBody] ChangeStatusRequest request)
        {
            try
            {
                // Convert the integer to ApplicationStatus enum
                if (!Enum.IsDefined(typeof(ApplicationStatus), request.StatusValue))
                {
                    return BadRequest(new { message = "Invalid status value" });
                }

                var status = (ApplicationStatus)request.StatusValue;
                var response = await _applicationService.ChangeStatusAsync(id, status);

                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Application not found" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error changing status for application {id}");
                return StatusCode(500, new { message = "An error occurred while changing application status" });
            }
        }
        [HttpGet("admin/submitted")]
        [Authorize(Roles = "Admin")] // Restrict to Admin role
        public async Task<ActionResult<List<ApplicationResponse>>> GetSubmittedApplications()
        {
            try
            {
                // Verify JWT role claim (redundant with [Authorize] but good practice)
                if (!User.IsInRole("Admin"))
                {
                    return Forbid();
                }

                var applications = await _applicationService.GetSubmittedApplicationsAsync();
                return Ok(applications);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving submitted applications");
                return StatusCode(500, new { message = "Failed to retrieve applications" });
            }
        }
    }
}