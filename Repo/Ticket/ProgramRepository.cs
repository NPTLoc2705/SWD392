using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
using DAL;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repo.Ticket
{
    public class ProgramRepository : IProgramRepository
    {
        private readonly ProgramDAO _programDAO;

        public ProgramRepository(AppDbContext appDbContext)
        {
            _programDAO = new ProgramDAO(appDbContext);
        }

        public Task<ProgramResponse> CreateAsync(CreateProgramRequest program)
        => _programDAO.CreateAsync(program);

        public Task<ProgramResponse> DeleteAsync(string id)
        => _programDAO.DeleteAsync(id);

        public Task<IEnumerable<ProgramResponse>> GetAllAsync()
        => _programDAO.GetAllAsync();

        public Task<ProgramResponse> GetByIdAsync(string id)
        => _programDAO.GetByIdAsync(id);

        public Task<bool> ProgramExistsAsync(string id)
        => _programDAO.ProgramExistsAsync(id);

        public Task<ProgramResponse> UpdateAsync(string id,UpdateProgramRequest program)
        => _programDAO.UpdateAsync(id,program);
    }
}