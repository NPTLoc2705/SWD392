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
    public interface IApplicationService
    {
        Task<ApplicationResponse> CreateDraftAsync(int studentId, ApplicationRequest request);
        Task<ApplicationResponse> SubmitApplicationAsync(string applicationId);
        Task<ApplicationResponse> GetByIdAsync(string id);
        Task<List<ApplicationResponse>> GetByStudentAsync(int studentId);
        Task<ApplicationResponse> UpdateAsync(string id, UpdateApplicationRequest request);
        Task<ApplicationResponse> ChangeStatusAsync(string id, ApplicationStatus newStatus);

        Task<List<ApplicationResponse>> GetSubmittedApplicationsAsync();
    }
}
