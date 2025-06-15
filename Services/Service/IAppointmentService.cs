using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BO.dtos.Request;
using BO.dtos.Response;

namespace Services.Service
{
    public interface IAppointmentService
    {
        Task<BookAppointmentResponse> BookAppointmentAsync(BookAppointmentRequest request);
        Task<AppointmentPaymentResultResponse> HandlePaymentCallbackAsync(string appointmentId, string vnpResponseCode);
    }
}
