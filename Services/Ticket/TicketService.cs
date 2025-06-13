using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
using Repo.Ticket;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Ticket
{
    public class TicketService : ITicketService
    {
        private readonly ITicketRepository _ticketRepository;
        public TicketService(ITicketRepository ticketRepository)
        {
            _ticketRepository = ticketRepository; 
        }
       

        public Task<TicketResponse> AssignTicketToConsultantAsync(string ticketId, int consultantId)
        => _ticketRepository.AssignTicketToConsultantAsync(ticketId, consultantId);

        public Task<TicketResponse> CreateTicketAsync(TicketRequest request, int studentId)
        => _ticketRepository.CreateTicketAsync(request, studentId);

        public Task<IEnumerable<TicketResponse>> GetAllTicketsAsync()
        => _ticketRepository.GetAllTicketsAsync();
        public Task<TicketResponse> GetTicketByIdAsync(string ticketId)
        => _ticketRepository.GetTicketByIdAsync(ticketId);

        public Task<IEnumerable<TicketResponse>> GetTicketsByConsultantAsync(int consultantId)
        => _ticketRepository.GetTicketsByConsultantAsync(consultantId);

        public Task<IEnumerable<TicketResponse>> GetTicketsByStudentAsync(int studentId)
        => _ticketRepository.GetTicketsByStudentAsync(studentId);

        public Task<TicketResponse> UpdateTicketStatusAsync(string ticketId, int consultantId, Status status)
        => _ticketRepository.UpdateTicketStatusAsync(ticketId, consultantId, status);
    }
}
