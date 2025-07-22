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
    public interface IProgramService
    {
        Task<ProgramResponse> CreateAsync(CreateProgramRequest program);
        Task<IEnumerable<ProgramResponse>> GetAllAsync();
        Task<ProgramResponse> GetByIdAsync(string id);
        Task<ProgramResponse> UpdateAsync(string id, UpdateProgramRequest program);
        Task<ProgramResponse> DeleteAsync(string id);
        Task<IEnumerable<ProgramResponse>> GetAllForAdminAsync();
        Task<bool> ProgramExistsAsync(string id);
    }
}
