using BO.dtos.Request;
using BO.dtos.Response;
using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repo.Ticket
{
    public class FeedbackRepository : IFeedbackRepository
    {
        private readonly FeedbackDAO _feedbackDAO;
        public FeedbackRepository(AppDbContext context)
        {
            _feedbackDAO = new FeedbackDAO(context);
        }
        public Task<FeedbackResponse> CreateFeedbackAsync(FeedbackRequest request, int studentId)
        => _feedbackDAO.CreateFeedbackAsync(request, studentId);

        public Task<FeedbackResponse> GetFeedbackByIdAsync(string feedbackId)
        => _feedbackDAO.GetFeedbackByIdAsync(feedbackId);

        public Task<IEnumerable<FeedbackResponse>> GetFeedbacksByConsultantAsync(int consultantId)
        => _feedbackDAO.GetFeedbacksByConsultantAsync(consultantId);

        public Task<FeedbackResponse> UpdateFeedbackResponseAsync(string feedbackId, string response, int consultantId)
        => _feedbackDAO.UpdateFeedbackResponseAsync(feedbackId, response, consultantId);
    }
}
