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
    public class ApplicationService : IApplicationService 
    {
        private readonly IApplicationRepository applicationRepository;
        public ApplicationService(IApplicationRepository applicationRepository)
        {
            this.applicationRepository = applicationRepository;
        }

        public Task<ApplicationResponse> ChangeStatusAsync(string id, ApplicationStatus newStatus)
        => applicationRepository.ChangeStatusAsync(id, newStatus);

        public Task<ApplicationResponse> CreateDraftAsync(int studentId, ApplicationRequest request)
        => applicationRepository.CreateDraftAsync(studentId, request);

        public Task<ApplicationResponse> GetByIdAsync(string id)
        => applicationRepository.GetByIdAsync(id);  

        public Task<List<ApplicationResponse>> GetByStudentAsync(int studentId)
        => applicationRepository.GetByStudentAsync(studentId);

        public Task<ApplicationResponse> SubmitApplicationAsync(string applicationId)
        => applicationRepository.SubmitApplicationAsync(applicationId);

        public Task<ApplicationResponse> UpdateAsync(string id, UpdateApplicationRequest request)
        => applicationRepository.UpdateAsync(id, request);
    }
}
