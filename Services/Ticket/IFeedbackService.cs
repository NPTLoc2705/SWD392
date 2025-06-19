using BO.dtos.Request;
using BO.dtos.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Ticket
{
    public interface IFeedBackService
    {
        Task<FeedbackResponse> SubmitFeedbackAsync(FeedbackRequest request, int studentId);
        Task<FeedbackResponse> GetFeedbackAsync(string feedbackId);
        Task<IEnumerable<FeedbackResponse>> GetConsultantFeedbacksAsync(int consultantId);
        Task<FeedbackResponse> RespondToFeedbackAsync(string feedbackId, string response, int consultantId);
    }
}
