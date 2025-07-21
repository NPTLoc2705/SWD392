using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
using System.Threading.Tasks;

namespace Services.Service
{
    public interface IAppointmentService
    {

        Task<BookAppointmentResponse> BookAppointmentAsync(BookAppointmentRequest request);
        Task<AppointmentPaymentResultResponse> HandlePaymentCallbackAsync(int appointmentId, string vnpResponseCode);

        Task<List<Appointments>> GetConsultantAppointmentsAsync(int consultantId);
        Task<List<Appointments>> StudentGetAppointmentAsync(int studentId);

        Task<bool> UpdateAppointmentStatusAsync(int appointmentId, AppointmentStatus status);
    }
}
