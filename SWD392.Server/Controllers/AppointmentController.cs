using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
using DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Services.Service;

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
            if (result.Status == "InProcess")
                return Ok(result);
            return BadRequest(result);
        }
    }
}
