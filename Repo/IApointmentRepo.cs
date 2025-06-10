using BO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repo
{
    public interface IApointmentRepo
    {
        Task<Appointments> GetAppointmentsByIdAsync(int id);
        Task<List<Appointments>> GetAllAppointmentsAsync();
        Task AddAppointmentAsync(Appointments appointment);
        Task UpdateAppointmentAsync(Appointments appointment);
        Task DeleteAppointmentAsync(int id);
    }
}
