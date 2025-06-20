using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DAL
{
    public class FeedbackDAO
    {
        private readonly AppDbContext _context;

        public FeedbackDAO(AppDbContext context)
        {
            _context = context;
        }

        public async Task<FeedbackResponse> CreateFeedbackAsync(FeedbackRequest request, int studentId)
        {
            // Verify ticket exists and is completed
            var ticket = await _context.Tickets
                .Include(t => t.Consultant)
                .FirstOrDefaultAsync(t => t.Id == request.ticket_id && t.Status == Status.Completed);

            if (ticket == null)
                throw new Exception("Ticket not found or not completed");

            // Verify consultant was assigned to this ticket
            if (ticket.ConsultantId != request.consultant_id)
                throw new Exception("Consultant was not assigned to this ticket");

            // Check if feedback already exists for this ticket
            var existingFeedback = await _context.Feedback
                .FirstOrDefaultAsync(f => f.ticket_id == request.ticket_id);

            if (existingFeedback != null)
                throw new Exception("Feedback already submitted for this ticket");

            var feedback = new Feedback
            {
                ticket_id = request.ticket_id,
                student_id = studentId,
                consultant_id = request.consultant_id,
                rating = request.rating,
                comment = request.comment,
                created_at = DateTime.UtcNow
            };

            _context.Feedback.Add(feedback);
            await _context.SaveChangesAsync();

            return await GetFeedbackByIdAsync(feedback.id);
        }

        public async Task<FeedbackResponse> GetFeedbackByIdAsync(string feedbackId)
        {
            return await _context.Feedback
                .Where(f => f.id == feedbackId)
                .Include(f => f.Student)
                .Include(f => f.Consultant)
                .Select(f => new FeedbackResponse
                {
                    id = f.id,
                    ticket_id = f.ticket_id,
                    student_name = f.Student.Name,
                    consultant_name = f.Consultant.Name,
                    rating = f.rating,
                    comment = f.comment,
                    response = f.response,
                    created_at = f.created_at
                })
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<FeedbackResponse>> GetFeedbacksByConsultantAsync(int consultantId)
        {
            return await _context.Feedback
                .Where(f => f.consultant_id == consultantId)
                .Include(f => f.Student)
                .Include(f => f.Consultant)
                .OrderByDescending(f => f.created_at)
                .Select(f => new FeedbackResponse
                {
                    id = f.id,
                    ticket_id = f.ticket_id,
                    student_name = f.Student.Name,
                    consultant_name = f.Consultant.Name,
                    rating = f.rating,
                    comment = f.comment,
                    response = f.response,
                    created_at = f.created_at
                })
                .ToListAsync();
        }

        public async Task<FeedbackResponse> UpdateFeedbackResponseAsync(string feedbackId, string response, int consultantId)
        {
            var feedback = await _context.Feedback
                .Include(f => f.Student)
                .Include(f => f.Consultant)
                .FirstOrDefaultAsync(f => f.id == feedbackId);

            if (feedback == null)
                throw new Exception("Feedback not found");

            // Verify consultant is the one who received the feedback
            if (feedback.consultant_id != consultantId)
                throw new Exception("Unauthorized: Not your feedback");

            feedback.response = response;
            feedback.resolved = true;
            await _context.SaveChangesAsync();

            return new FeedbackResponse
            {
                id = feedback.id,
                ticket_id = feedback.ticket_id,
                student_name = feedback.Student.Name,
                consultant_name = feedback.Consultant.Name,
                rating = feedback.rating,
                comment = feedback.comment,
                response = feedback.response,
                created_at = feedback.created_at
            };
        }
    }
}