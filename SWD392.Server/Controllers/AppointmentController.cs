using API.Controllers;
using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
using DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Services.Service;
using System.Security.Claims;

namespace SWD392.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [Authorize(Roles = "Student")]
        [HttpPost("book")]
        public async Task<ActionResult<BookAppointmentResponse>> BookAppointment([FromBody] BookAppointmentRequest request)
        {
            // Get user ID from JWT token claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userIdClaim) || !int.TryParse(userIdClaim, out int studentId))
            {
                return Unauthorized(new { success = false, message = "Invalid user authentication" });
            }

            // Set the studentId from JWT token
            request.StudentId = studentId;

            var result = await _appointmentService.BookAppointmentAsync(request);
            if (!string.IsNullOrEmpty(result.AppointmentId))
                return Ok(result);
            return BadRequest(result);
        }

        [AllowAnonymous]
        [HttpGet("vnpay-callback")]
        public async Task<ActionResult<AppointmentPaymentResultResponse>> VNPayCallback([FromQuery] int vnp_TxnRef, [FromQuery] string vnp_ResponseCode)
        {
            var result = await _appointmentService.HandlePaymentCallbackAsync(vnp_TxnRef, vnp_ResponseCode);
            if (result.Status == "Confirmed")
                return Ok(result);
            return BadRequest(result);
        }

        [HttpGet("studentGetAppointment/{studentId}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> StudentGetAppointment(int studentId)
        {
            // Lấy userId từ token để đảm bảo chỉ lấy được lịch của chính mình
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out int userId) || userId != studentId)
                return Forbid("You can only view your own appointments");

            var result = await _appointmentService.StudentGetAppointmentAsync(studentId);
            return Ok(result);
        }
        // New endpoints for consultant
        [Authorize(Roles = "Consultant")]
        [HttpGet("consultant/{consultantId}")]
        public async Task<ActionResult<List<Appointments>>> GetConsultantAppointments(int consultantId)
        {
            var appointments = await _appointmentService.GetConsultantAppointmentsAsync(consultantId);
            return Ok(appointments);
        }

        [Authorize(Roles = "Consultant")]
        [HttpPut("{appointmentId}/status")]
        public async Task<ActionResult> UpdateAppointmentStatus(int appointmentId, [FromBody] UpdateAppointmentStatusRequest request)
        {
            // Validate the enum value
            if (!Enum.IsDefined(typeof(AppointmentStatus), request.Status))
            {
                return BadRequest(new { message = "Invalid status value" });
            }

            var result = await _appointmentService.UpdateAppointmentStatusAsync(appointmentId, request.Status);
            if (result)
                return Ok(new { message = "Status updated successfully" });
            return NotFound(new { message = "Appointment not found" });
        }
    }
}