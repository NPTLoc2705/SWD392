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
    public class ProgramService : IProgramService
    {
        private readonly IProgramRepository _programRepository;

        public ProgramService(IProgramRepository programRepository)
        {
            _programRepository = programRepository;
        }

        public Task<ProgramResponse> CreateAsync(CreateProgramRequest program)
        => _programRepository.CreateAsync(program);

        public Task<ProgramResponse> DeleteAsync(string id)
        => _programRepository.DeleteAsync(id);

        public Task<IEnumerable<ProgramResponse>> GetAllAsync()
       => _programRepository.GetAllAsync();

        public Task<IEnumerable<ProgramResponse>> GetAllForAdminAsync()
        => _programRepository.GetAllForAdminAsync();

        public Task<ProgramResponse> GetByIdAsync(string id)
        => _programRepository.GetByIdAsync(id);

        public Task<bool> ProgramExistsAsync(string id)
        => _programRepository.ProgramExistsAsync(id);

        public Task<ProgramResponse> UpdateAsync(string id, UpdateProgramRequest program)
        => _programRepository.UpdateAsync(id,program);
    }
}