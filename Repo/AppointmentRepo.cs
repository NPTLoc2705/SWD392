using BO.Models;
using DAL;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repo
{
    public class AppointmentRepo : IApointmentRepo
    {
        private readonly AppDbContext _context;
        public AppointmentRepo(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Appointments> GetByIdAsync(string id)
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

        public async Task DeleteAsync(string id)
        {
            var entity = await _context.Appointments.FindAsync(id);
            if (entity != null)
            {
                _context.Appointments.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public Task<Appointments> GetAppointmentsByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<Appointments>> GetAllAppointmentsAsync()
        {
            throw new NotImplementedException();
        }

        public Task AddAppointmentAsync(Appointments appointment)
        {
            throw new NotImplementedException();
        }

        public Task UpdateAppointmentAsync(Appointments appointment)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAppointmentAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
