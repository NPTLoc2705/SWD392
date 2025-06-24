using BO.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repo
{
    public interface IAppointmentRepo
    {
        Task<Appointments> GetByIdAsync(int id);
        Task<List<Appointments>> GetAllAsync();
        Task AddAsync(Appointments appointment);
        Task UpdateAsync(Appointments appointment);
        Task DeleteAsync(int id);

        Task<List<int>> GetBusyConsultantIdsAsync();
        Task<List<User>> GetAvailableConsultantsAsync(List<int> busyConsultantIds);
        Task<List<User>> GetAllConsultantsAsync();
        Task<User> GetStudentByIdAsync(int studentId);

        Task<List<Appointments>> GetAppointmentsByConsultantIdAsync(int consultantId);
        Task UpdateAppointmentStatusAsync(int appointmentId, AppointmentStatus status);
    }
}
