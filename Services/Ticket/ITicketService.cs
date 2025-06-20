using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Ticket
{
    public interface ITicketService
    {
        Task<TicketResponse> CreateTicketAsync(TicketRequest request, int studentId);
        Task<IEnumerable<TicketResponse>> GetTicketsByStudentAsync(int studentId);
        Task<IEnumerable<TicketResponse>> GetTicketsByConsultantAsync(int consultantId);
        Task<IEnumerable<TicketResponse>> GetAllTicketsAsync();
        Task<TicketResponse> UpdateTicketStatusAsync(string ticketId, int consultantId, Status status);
        Task<TicketResponse> AssignTicketToConsultantAsync(string ticketId, int consultantId);

        Task<TicketResponse> GetTicketByIdAsync(string ticketId);

        Task<IEnumerable<ConsultantResponse>> GetAvailableConsultantsAsync();
        Task<List<Status>> GetAllowedStatusesAsync(string ticketId);
    }
}
