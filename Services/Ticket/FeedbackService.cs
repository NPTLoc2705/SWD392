using BO.dtos.Request;
using BO.dtos.Response;
using Repo.Ticket;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Ticket
{
    public class FeedbackService : IFeedBackService
    {
        private readonly IFeedbackRepository _feedbackRepository;
        public FeedbackService(IFeedbackRepository feedbackRepository)
        {
            _feedbackRepository = feedbackRepository;
        }

        public Task<IEnumerable<FeedbackResponse>> GetConsultantFeedbacksAsync(int consultantId)
        => _feedbackRepository.GetFeedbacksByConsultantAsync(consultantId);

        public Task<FeedbackResponse> GetFeedbackAsync(string feedbackId)
        => _feedbackRepository.GetFeedbackByIdAsync(feedbackId);

        public Task<FeedbackResponse> RespondToFeedbackAsync(string feedbackId, string response, int consultantId)
        => _feedbackRepository.UpdateFeedbackResponseAsync(feedbackId, response, consultantId);

        public Task<FeedbackResponse> SubmitFeedbackAsync(string ticketId, FeedbackRatingRequest request, int studentId)
        => _feedbackRepository.SubmitFeedbackAsync(ticketId, request, studentId);
    }
}
