using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
using Repo;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Services.Service
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepo _appointmentRepo;
        private readonly VNPayService _vnpay;

        public AppointmentService(IAppointmentRepo appointmentRepo, VNPayService vnpay)
        {
            _appointmentRepo = appointmentRepo;
            _vnpay = vnpay;
        }

        public async Task<BookAppointmentResponse> BookAppointmentAsync(BookAppointmentRequest request)
        {
            var student = await _appointmentRepo.GetStudentByIdAsync(request.StudentId);
            if (student == null)
                return new BookAppointmentResponse { Messsage = "User không hợp lệ hoặc không phải student." };

            var busyConsultantIds = await _appointmentRepo.GetBusyConsultantIdsAsync();
            var availableConsultants = await _appointmentRepo.GetAvailableConsultantsAsync(busyConsultantIds);

            if (!availableConsultants.Any())
            {
                availableConsultants = await _appointmentRepo.GetAllConsultantsAsync();
            }

            if (!availableConsultants.Any())
                return new BookAppointmentResponse { Messsage = "Không có consultant nào khả dụng." };

            var random = new Random();
            var consultant = availableConsultants[random.Next(availableConsultants.Count)];

            var appointment = new Appointments
            {
                StudentId = request.StudentId,
                StudentName = request.StudentName,
                ConsultantId = consultant.Id,
                ConsultantName = consultant.Name,
                Status = "Pending",
                IsPriority = request.IsPriority,
                Create_at = DateTime.UtcNow,
                Update_at = DateTime.UtcNow
            };

            await _appointmentRepo.AddAsync(appointment);

            var paymentUrl = _vnpay.CreatePaymentUrl(appointment.Id.ToString(), 100000, "Thanh toán đặt lịch hẹn");

            return new BookAppointmentResponse
            {
                AppointmentId = appointment.Id.ToString(),
                ConsultantId = consultant.Id.ToString(),
                ConsultantName = consultant.Name,
                ConsultantEmail = consultant.Email,
                PaymentUrl = paymentUrl,
                Messsage = "Đặt lịch thành công! Vui lòng thanh toán để hoàn tất đặt lịch."
            };
        }

        public async Task<AppointmentPaymentResultResponse> HandlePaymentCallbackAsync(int appointmentId, string vnpResponseCode)
        {
            var appointment = await _appointmentRepo.GetByIdAsync(appointmentId);
            if (appointment == null)
                return new AppointmentPaymentResultResponse { Messsage = "Không tìm thấy lịch hẹn." };

            if (vnpResponseCode == "00")
            {
                appointment.Status = "InProcess";
                appointment.Update_at = DateTime.UtcNow;
                await _appointmentRepo.UpdateAsync(appointment);

                return new AppointmentPaymentResultResponse
                {
                    AppointmentId = appointment.Id.ToString(),
                    Status = appointment.Status,
                    ConsultantName = appointment.ConsultantName,
                    Messsage = "Đặt lịch thành công!"
                };
            }
            else
            {
                appointment.Status = "Pending";
                await _appointmentRepo.UpdateAsync(appointment);

                return new AppointmentPaymentResultResponse
                {
                    AppointmentId = appointment.Id.ToString(),
                    Status = appointment.Status,
                    Messsage = "Thanh toán không thành công."
                };
            }
        }
    }
}
