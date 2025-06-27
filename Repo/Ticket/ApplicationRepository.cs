using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
using DAL;
using DAL.Files;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repo.Ticket
{
    public class ApplicationRepository : IApplicationRepository
    {
        private readonly ApplicationDAO _applicationDAO;
        private readonly IFileService _fileService;
        public ApplicationRepository(AppDbContext appDbContext, IFileService fileService)
        {
            _applicationDAO = new ApplicationDAO(appDbContext, fileService);
        }

        public Task<ApplicationResponse> ChangeStatusAsync(string id, ApplicationStatus newStatus)
        => _applicationDAO.ChangeStatusAsync(id, newStatus);

        public Task<ApplicationResponse> CreateDraftAsync(int studentId, ApplicationRequest request)
        => _applicationDAO.CreateDraftAsync(studentId, request);

        public Task<ApplicationResponse> GetByIdAsync(string id)
        => _applicationDAO.GetByIdAsync(id);

        public Task<List<ApplicationResponse>> GetByStudentAsync(int studentId)
        => _applicationDAO.GetByStudentAsync(studentId);

        public Task<ApplicationResponse> SubmitApplicationAsync(string applicationId)
        => _applicationDAO.SubmitApplicationAsync(applicationId);

        public Task<ApplicationResponse> UpdateAsync(string id, UpdateApplicationRequest request)
        => _applicationDAO.UpdateAsync(id, request);
    }
}
