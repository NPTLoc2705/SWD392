using BO.Models;
using DAL;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repo
{
    public class AppointmentRepo : IAppointmentRepo
    {
        private readonly AppointmentDAO _dao;

        public AppointmentRepo(AppointmentDAO dao)
        {
            _dao = dao;
        }

        public Task<Appointments> GetByIdAsync(int id)
            => _dao.GetByIdAsync(id);

        public Task<List<Appointments>> GetAllAsync()
            => _dao.GetAllAsync();

        public Task AddAsync(Appointments appointment)
            => _dao.AddAsync(appointment);

        public Task UpdateAsync(Appointments appointment)
            => _dao.UpdateAsync(appointment);

        public Task DeleteAsync(int id)
            => _dao.DeleteAsync(id);

        public Task<List<int>> GetBusyConsultantIdsAsync()
            => _dao.GetBusyConsultantIdsAsync();

        public Task<List<User>> GetAvailableConsultantsAsync(List<int> busyConsultantIds)
            => _dao.GetAvailableConsultantsAsync(busyConsultantIds);

        public Task<List<User>> GetAllConsultantsAsync()
            => _dao.GetAllConsultantsAsync();

        public Task<User> GetStudentByIdAsync(int studentId)
            => _dao.GetStudentByIdAsync(studentId);

        public Task<List<Appointments>> GetAppointmentsByConsultantIdAsync(int consultantId)
            => _dao.GetAppointmentsByConsultantIdAsync(consultantId);

        public Task<List<Appointments>> StudentGetAppointmentsAsync(int studentId)
    => _dao.StudentGetAppointmentsAsync(studentId);

        public Task UpdateAppointmentStatusAsync(int appointmentId, AppointmentStatus status)
            => _dao.UpdateAppointmentStatusAsync(appointmentId, status);
    }
}