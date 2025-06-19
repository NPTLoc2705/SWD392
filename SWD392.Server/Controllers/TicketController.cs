using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Ticket;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Require authentication for all endpoints
    public class TicketController : ControllerBase
    {
        private readonly ITicketService _ticketService;

        public TicketController(ITicketService ticketService)
        {
            _ticketService = ticketService;
        }

        // GET: api/ticket
        [HttpGet]
        [Authorize(Roles = "Admin,Consultant")] // Only admin and consultants can view all tickets
        public async Task<ActionResult<IEnumerable<TicketResponse>>> GetAllTickets()
        {
            try
            {
                var tickets = await _ticketService.GetAllTicketsAsync();
                return Ok(new
                {
                    success = true,
                    message = "Tickets retrieved successfully",
                    data = tickets
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while retrieving tickets",
                    error = ex.Message
                });
            }
        }

        // GET: api/ticket/{id}/view
        [HttpGet("{id}/ticket-detail")]
        public async Task<ActionResult<TicketResponse>> GetTicketById(string id)
        {
            try
            {
                var ticket = await _ticketService.GetTicketByIdAsync(id);
                if (ticket == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Ticket not found"
                    });
                }

                // Check authorization - students can only view their own tickets
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

                if (userRole == "Student")
                {
                    // Students can only view their own tickets
                    var studentTickets = await _ticketService.GetTicketsByStudentAsync(userId);
                    if (!studentTickets.Any(t => t.Id == id))
                    {
                        return Forbid();
                    }
                }
                else if (userRole == "Consultant")
                {
                    // Allow consultants to view unassigned tickets or tickets assigned to them
                    if (ticket.ConsultantName != null && ticket.ConsultantName != User.FindFirst(ClaimTypes.Name)?.Value)
                    {
                        return Forbid();
                    }
                    // If ConsultantName is null, it's an unassigned ticket that consultants can view
                }

                return Ok(new
                {
                    success = true,
                    message = "Ticket retrieved successfully",
                    data = ticket
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while retrieving the ticket",
                    error = ex.Message
                });
            }
        }

        // POST: api/ticket/create
        [HttpPost("create")]
        [Authorize(Roles = "Student")] // Only students can create tickets
        public async Task<ActionResult<TicketResponse>> CreateTicket([FromBody] TicketRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid ticket data",
                        errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                    });
                }

                var studentId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var ticket = await _ticketService.CreateTicketAsync(request, studentId);

                return CreatedAtAction(nameof(GetTicketById), new { id = ticket.Id }, new
                {
                    success = true,
                    message = "Ticket created successfully",
                    data = ticket
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while creating the ticket",
                    error = ex.Message
                });
            }
        }

        

        // GET: api/ticket/student/my-tickets
        [HttpGet("student/my-tickets")]
        [Authorize(Roles = "Student")] // Only students can view their own tickets
        public async Task<ActionResult<IEnumerable<TicketResponse>>> GetMyTickets()
        {
            try
            {
                var studentId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var tickets = await _ticketService.GetTicketsByStudentAsync(studentId);

                return Ok(new
                {
                    success = true,
                    message = "Student tickets retrieved successfully",
                    data = tickets
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while retrieving student tickets",
                    error = ex.Message
                });
            }
        }




        //Get all the consultants which is currently available
        [HttpGet("consultants-available")]
        [Authorize(Roles = "Admin")] // Only admin can view available consultants
        public async Task<ActionResult<IEnumerable<ConsultantResponse>>> GetAvailableConsultants()
        {
            try
            {
                var consultants = await _ticketService.GetAvailableConsultantsAsync();
                return Ok(new
                {
                    success = true,
                    message = "Consultants retrieved successfully",
                    data = consultants
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while retrieving consultants",
                    error = ex.Message
                });
            }
        }

        

        // Get all the tickets assigned to the consultant
        // GET: api/ticket/consultant/assigned        
        [HttpGet("consultant/assigned")]
        [Authorize(Roles = "Consultant")] // Only consultants can view their assigned tickets
        public async Task<ActionResult<IEnumerable<TicketResponse>>> GetAssignedTickets()
        {
            try
            {
                var consultantId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var tickets = await _ticketService.GetTicketsByConsultantAsync(consultantId);

                return Ok(new
                {
                    success = true,
                    message = "Consultant tickets retrieved successfully",
                    data = tickets
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while retrieving consultant tickets",
                    error = ex.Message
                });
            }
        }

        // PUT: api/ticket/{id}/assign
        [HttpPut("{id}/assign")]
        [Authorize(Roles = "Admin")] // only Admin can assign the consultant to the ticket 
        public async Task<ActionResult<TicketResponse>> AssignTicket(string id, [FromBody] AssignTicketRequest request)
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var consultantId = request.ConsultantId;

                // If consultant is assigning to themselves
                if (userRole == "Consultant")
                {
                    var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                    if (consultantId != currentUserId)
                    {
                        return Forbid("Consultants can only assign tickets to themselves");
                    }
                }

                var ticket = await _ticketService.AssignTicketToConsultantAsync(id, consultantId);

                return Ok(new
                {
                    success = true,
                    message = "Ticket assigned successfully",
                    data = ticket
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while assigning the ticket",
                    error = ex.Message
                });
            }
        }

        

        // PUT: api/ticket/{id}/status
        [HttpPut("{id}/status/update")]
        [Authorize(Roles = "Consultant")] // Only consultants can update ticket status
        public async Task<ActionResult<TicketResponse>> UpdateTicketStatus(string id, [FromBody] UpdateStatusRequest request)
        {
            try
            {
                var consultantId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var ticket = await _ticketService.UpdateTicketStatusAsync(id, consultantId, request.Status);

                return Ok(new
                {
                    success = true,
                    message = "Ticket status updated successfully",
                    data = ticket
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while updating the ticket status",
                    error = ex.Message
                });
            }
        }


        //To get allowed statuses for a ticket
        // Get: api/ticket/{id}/allowed-statuses
        [HttpGet("{id}/allowed-statuses")]
        [Authorize(Roles = "Consultant")]
        public async Task<ActionResult<List<Status>>> GetAllowedStatuses(string id)
        {
            try
            {
                var allowedStatuses = await _ticketService.GetAllowedStatusesAsync(id);
                return Ok(new
                {
                    success = true,
                    message = "Allowed statuses retrieved",
                    data = allowedStatuses
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

    }

    // Additional DTOs for specific requests
    public class AssignTicketRequest
    {
        public int ConsultantId { get; set; }
    }

    public class AddResponseRequest
    {
        [Required]
        public string Response { get; set; }
    }

    public class UpdateStatusRequest
    {
        [Required]
        public Status Status { get; set; }
    }
}