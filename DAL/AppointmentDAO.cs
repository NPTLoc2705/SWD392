using BO.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class AppointmentDAO
    {
        private readonly AppDbContext _context;

        public AppointmentDAO(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Appointments> GetByIdAsync(int id)
            => await _context.Appointments
                .Include(a => a.Student)
                .Include(a => a.Consultant)
                .FirstOrDefaultAsync(a => a.Id == id);

        public async Task<List<Appointments>> GetAllAsync()
            => await _context.Appointments
                .Include(a => a.Student)
                .Include(a => a.Consultant)
                .OrderByDescending(a => a.Create_at)
                .ToListAsync();

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
                .Where(a => a.Status == AppointmentStatus.Confirmed)
                .Select(a => a.ConsultantId)
                .Distinct()
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

        public async Task<List<Appointments>> GetAppointmentsByConsultantIdAsync(int consultantId)
        {
            return await _context.Appointments
                .Include(a => a.Student)
                .Where(a => a.ConsultantId == consultantId)
                .OrderBy(a => a.Create_at)
                .ToListAsync();
        }

        public async Task<List<Appointments>> StudentGetAppointmentsAsync(int studentId)
        {
            return await _context.Appointments
                .Include(a => a.Consultant)
                .Include(a => a.Student).ThenInclude(s => s.Role)
                .Where(a => a.StudentId == studentId && a.Student.Role.Name == "Student")
                .OrderByDescending(a => a.Create_at)
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
