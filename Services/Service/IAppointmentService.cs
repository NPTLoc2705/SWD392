using BO.dtos.Request;
using BO.dtos.Response;
using System.Threading.Tasks;

namespace Services.Service
{
    public interface IAppointmentService
    {
        /// <summary>
        /// Book an appointment for a student and return payment information.
        /// </summary>
        /// <param name="request">The appointment booking request.</param>
        /// <returns>BookAppointmentResponse with payment link and consultant info.</returns>
        Task<BookAppointmentResponse> BookAppointmentAsync(BookAppointmentRequest request);

        /// <summary>
        /// Handle the payment callback from VNPay and update the appointment status.
        /// </summary>
        /// <param name="appointmentId">The ID of the appointment.</param>
        /// <param name="vnpResponseCode">The VNPay response code.</param>
        /// <returns>AppointmentPaymentResultResponse with the final status of the appointment.</returns>
        Task<AppointmentPaymentResultResponse> HandlePaymentCallbackAsync(int appointmentId, string vnpResponseCode);
    }
}
