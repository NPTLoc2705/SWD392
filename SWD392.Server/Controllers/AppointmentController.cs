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
        public async Task<ActionResult> UpdateAppointmentStatus(int appointmentId, [FromBody] AppointmentStatus status)
        {
            var result = await _appointmentService.UpdateAppointmentStatusAsync(appointmentId, status);
            if (result)
                return Ok(new { message = "Status updated successfully" });
            return NotFound(new { message = "Appointment not found" });
        }
    }
}