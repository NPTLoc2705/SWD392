using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repo.Ticket
{
    public class TicketRepository : ITicketRepository
    {
        private readonly TicketDAO TicketDAO;
        public TicketRepository(TicketDAO ticketDAO)
        {
            TicketDAO = ticketDAO;
        }

        public Task<TicketResponse> AssignTicketToConsultantAsync(string ticketId, int consultantId)
        => TicketDAO.AssignTicketToConsultantAsync(ticketId, consultantId);

        public Task<TicketResponse> CreateTicketAsync(TicketRequest request, int studentId)
        => TicketDAO.CreateTicketAsync(request, studentId);

        public Task<List<Status>> GetAllowedStatusesAsync(string ticketId)
        => TicketDAO.GetAllowedStatusesAsync(ticketId);

        public Task<IEnumerable<TicketResponse>> GetAllTicketsAsync()
        => TicketDAO.GetAllTicketsAsync();

        public Task<IEnumerable<ConsultantResponse>> GetAvailableConsultantsAsync()
        => TicketDAO.GetAvailableConsultantsAsync();

        public Task<TicketResponse> GetTicketByIdAsync(string ticketId)
        => TicketDAO.GetTicketByIdAsync(ticketId);

        public Task<IEnumerable<TicketResponse>> GetTicketsByConsultantAsync(int consultantId)
        => TicketDAO.GetTicketsByConsultantAsync(consultantId);

        public Task<IEnumerable<TicketResponse>> GetTicketsByStudentAsync(int studentId)
        => TicketDAO.GetTicketsByStudentAsync(studentId);

        public Task<TicketResponse> UpdateTicketStatusAsync(string ticketId, int consultantId, Status status)
        => TicketDAO.UpdateTicketStatusAsync(ticketId, consultantId, status);
    }
}
