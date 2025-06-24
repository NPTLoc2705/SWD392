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
        private readonly AppDbContext _context;

        public AppointmentRepo(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Appointments> GetByIdAsync(int id)
            => await _context.Appointments.FindAsync(id);

        public async Task<List<Appointments>> GetAllAsync()
            => await _context.Appointments.ToListAsync();

        public async Task AddAsync(Appointments appointment)
        {
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Appointments appointment)
        {
            _context.Appointments.Update(appointment);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.Appointments.FindAsync(id);
            if (entity != null)
            {
                _context.Appointments.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<int>> GetBusyConsultantIdsAsync()
        {
            return await _context.Appointments
                .Where(a => a.Status == AppointmentStatus.Confirmed || a.Status == AppointmentStatus.InProgress)
                .Select(a => a.ConsultantId)
                .ToListAsync();
        }

        public async Task<List<User>> GetAvailableConsultantsAsync(List<int> busyConsultantIds)
        {
            return await _context.User
                .Include(u => u.Role)
                .Where(u => u.Role.Name == "Consultant" && !busyConsultantIds.Contains(u.Id))
                .ToListAsync();
        }

        public async Task<List<User>> GetAllConsultantsAsync()
        {
            return await _context.User
                .Include(u => u.Role)
                .Where(u => u.Role.Name == "Consultant")
                .ToListAsync();
        }

        public async Task<User> GetStudentByIdAsync(int studentId)
        {
            return await _context.User
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == studentId && u.Role.Name == "Student");
        }

        // New methods for consultant
        public async Task<List<Appointments>> GetAppointmentsByConsultantIdAsync(int consultantId)
        {
            return await _context.Appointments
                .Include(a => a.Student)
                .Where(a => a.ConsultantId == consultantId)
                .OrderBy(a => a.Create_at)
                .ToListAsync();
        }

        public async Task UpdateAppointmentStatusAsync(int appointmentId, AppointmentStatus status)
        {
            var appointment = await _context.Appointments.FindAsync(appointmentId);
            if (appointment != null)
            {
                appointment.Status = status;
                appointment.Update_at = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }
    }
}