using BO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.dtos.Response
{
    public class TicketResponse
    {
        public string Id { get; set; }
        public string Subject { get; set; }
        public string Question { get; set; }
        public Status Status { get; set; }
        public string StatusName => Status.ToString();
        public DateTime CreatedAt { get; set; }
        public string StudentName { get; set; }
        public string StudentEmail { get; set; }// From User.name
        public string? ConsultantName { get; set; }
        public string feedbackId { get; set; } // Feedback ID if exists
        public FeedbackResponse Feedback { get; set; }
    }
    public class ConsultantResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
