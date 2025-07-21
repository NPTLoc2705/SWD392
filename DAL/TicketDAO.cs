using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class TicketDAO
    {
    private readonly AppDbContext _context;

    public TicketDAO(AppDbContext context)
    {
        _context = context;
    }

        public async Task<TicketResponse> CreateTicketAsync(TicketRequest request, int studentId)
        {
            var ticket = new Tickets
            {
                StudentId = studentId,
                Subject = request.Subject,
                Message = request.Message,
                Status = Status.Pending,
                created_at = DateTime.UtcNow,
                updated_at = DateTime.UtcNow
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            return await GetTicketByIdAsync(ticket.Id);
        }

        public async Task<IEnumerable<TicketResponse>> GetTicketsByStudentAsync(int studentId)
    {
        return await _context.Tickets
            .Where(t => t.StudentId == studentId)
            .Include(t => t.Student)
            .Include(t => t.Consultant)
            .Include(t => t.Feedback) // Include Feedback if needed
            .OrderByDescending(t => t.created_at)
            .Select(t => new TicketResponse
            {
                Id = t.Id,
                Subject = t.Subject,
                Question = t.Message,
                Status = t.Status,
                CreatedAt = t.created_at,
                StudentName = t.Student.Name,
                ConsultantName = t.Consultant != null ? t.Consultant.Name : null,
                feedbackId = t.Feedback != null ? t.Feedback.id : null
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<TicketResponse>> GetTicketsByConsultantAsync(int consultantId)
    {
        return await _context.Tickets
            .Where(t => t.ConsultantId == consultantId)
            .Include(t => t.Student)
            .Include(t => t.Consultant)
            .OrderByDescending(t => t.created_at)
            .Select(t => new TicketResponse
            {
                Id = t.Id,
                Subject = t.Subject,
                Question = t.Message,
                Status = t.Status,
                CreatedAt = t.created_at,
                StudentName = t.Student.Name,
                ConsultantName = t.Consultant != null ? t.Consultant.Name : null
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<TicketResponse>> GetAllTicketsAsync()
    {
        return await _context.Tickets
            .Include(t => t.Student)
            .Include(t => t.Consultant)
            .OrderByDescending(t => t.created_at)
            .Select(t => new TicketResponse
            {
                Id = t.Id,
                Subject = t.Subject,
                Question = t.Message,
                Status = t.Status,
                CreatedAt = t.created_at,
                StudentName = t.Student.Name,
                StudentEmail = t.Student.Email,
                ConsultantName = t.Consultant != null ? t.Consultant.Name : null
            })
            .ToListAsync();
    }



        //Function allow consultant to update the ticket 
        public async Task<TicketResponse> UpdateTicketStatusAsync(string ticketId, int consultantId, Status status)
        {
            var ticket = await _context.Tickets.FindAsync(ticketId);
            if (ticket == null) throw new Exception("Ticket not found");

            // Verify consultant is assigned to this ticket
            if (ticket.ConsultantId != consultantId)
                throw new Exception("Unauthorized: Not assigned to this ticket");

            // Validate status transitions
            switch (ticket.Status)
            {
                case Status.Pending:
                    throw new Exception("Use Assign endpoint instead");

                case Status.Assigned:
                    if (status != Status.Answered && status != Status.Cancelled)
                        throw new Exception("Assigned tickets can only become Answered or Cancelled");
                    break;

                case Status.Answered:
                    throw new Exception($"Ticket is already {ticket.Status} (terminal state)");

            }

            ticket.Status = status;
            ticket.updated_at = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return await GetTicketByIdAsync(ticket.Id);
        }

        public async Task<TicketResponse> AssignTicketToConsultantAsync(string ticketId, int consultantId)
        {
            var ticket = await _context.Tickets.FindAsync(ticketId);
            if (ticket == null)
                throw new Exception("Ticket not found");
            var exitsConsultant = await _context.User.FindAsync(consultantId);
            if (exitsConsultant == null || exitsConsultant.RoleId != 2) // Assuming RoleId 2 is for Consultant
            { 
                throw new Exception("Only users with consultant role can be assigned to tickets"); 
            }
            // this condition checks if the ticket is in a state that allows reassignment
            if (ticket.Status != Status.Pending && ticket.Status != Status.Assigned && ticket.Status != Status.Answered) 
            {
                throw new Exception($"Ticket cannot be reassigned in {ticket.Status} status");
            }

            ticket.ConsultantId = consultantId;
            ticket.Status = Status.Assigned;
            ticket.updated_at = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return await GetTicketByIdAsync(ticket.Id);
        }



        public async Task<TicketResponse> GetTicketByIdAsync(string ticketId)
    {
        return await _context.Tickets
            .Where(t => t.Id == ticketId)
            .Include(t => t.Student)
            .Include(t => t.Consultant)
            .Include(t => t.Feedback) // Include Feedback if needed
            .Select(t => new TicketResponse
            {
                Id = t.Id,
                Subject = t.Subject,
                Question = t.Message,
                Status = t.Status,
                CreatedAt = t.created_at,
                StudentName = t.Student.Name,
                StudentEmail = t.Student.Email,
                ConsultantName = t.Consultant != null ? t.Consultant.Name : null,
 Feedback = t.Feedback != null ? new FeedbackResponse
 {
     id = t.Feedback.id,
     ticket_id = t.Feedback.ticket_id,
     student_name = t.Student.Name,
     consultant_name = t.Consultant.Name,
     rating = t.Feedback.rating,
     comment = t.Feedback.comment,
     response = t.Feedback.response,
     created_at = t.Feedback.created_at
 } : null
            })
            .FirstOrDefaultAsync();
    }
        public async Task<IEnumerable<ConsultantResponse>> GetAvailableConsultantsAsync()
        {
            return await _context.User
                .Where(u => u.RoleId == 2) // Assuming RoleId 2 is for Consultant
                .Select(u => new ConsultantResponse
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email
                })
                .ToListAsync();
        }

        public async Task<List<Status>> GetAllowedStatusesAsync(string ticketId)
        {
            var ticket = await _context.Tickets.FindAsync(ticketId);
            if (ticket == null) throw new Exception("Ticket not found");

            return ticket.Status switch
            {
                Status.Assigned => new List<Status> { Status.Answered, Status.Cancelled },
                _ => new List<Status>() // Block updates for Pending/Completed/Cancelled
            };
        }
    }
}
