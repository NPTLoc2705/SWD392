using BO.dtos.Request;
using BO.dtos.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repo.Ticket
{
    public interface IFeedbackRepository
    {
        Task<FeedbackResponse> CreateFeedbackAsync(FeedbackRequest request, int studentId);
        Task<FeedbackResponse> GetFeedbackByIdAsync(string feedbackId);
        Task<IEnumerable<FeedbackResponse>> GetFeedbacksByConsultantAsync(int consultantId);
        Task<FeedbackResponse> UpdateFeedbackResponseAsync(string feedbackId, string response, int consultantId);
    }
}
