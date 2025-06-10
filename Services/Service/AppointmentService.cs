using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
using DAL;
using Microsoft.EntityFrameworkCore;

namespace Services.Service
{
    public class AppointmentService : IAppointmentService
    {
        private readonly AppDbContext _context;
        private readonly VNPayService _vnpay;

        public AppointmentService(AppDbContext context, VNPayService vnpay)
        {
            _context = context;
            _vnpay = vnpay;
        }

        public async Task<BookAppointmentResponse> BookAppointmentAsync(BookAppointmentRequest request)
        {
            var student = await _context.Student
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id.ToString() == request.StudentId && u.Role.Name == "Student");
            if (student == null)
                return new BookAppointmentResponse { Messsage = "User không hợp lệ hoặc không phải student." };

            // Lấy danh sách consultant chưa có lịch hẹn Pending/InProcess
            var busyConsultantIds = await _context.Appointments
                .Where(a => a.Status == "Pending" || a.Status == "InProcess")
                .Select(a => a.ConsultantId)
                .ToListAsync();

            var availableConsultants = await _context.Student
                .Include(u => u.Role)
                .Where(u => u.Role.Name == "Consultant" && !busyConsultantIds.Contains(u.Id.ToString()))
                .ToListAsync();

            if (!availableConsultants.Any())
            {
                availableConsultants = await _context.Student
                    .Include(u => u.Role)
                    .Where(u => u.Role.Name == "Consultant")
                    .ToListAsync();
            }

            if (!availableConsultants.Any())
                return new BookAppointmentResponse { Messsage = "Không có consultant nào khả dụng." };

            var random = new Random();
            var consultant = availableConsultants[random.Next(availableConsultants.Count)];

            var appointment = new Appointments
            {
                Id = Guid.NewGuid().ToString("N"),
                StudentId = request.StudentId,
                StudentName = request.StudentName,
                ConsultantId = consultant.Id.ToString(),
                ConsultantName = consultant.Name,
                Status = "Pending",
                IsPriority = request.IsPriority,
                Create_at = DateTime.UtcNow,
                Update_at = DateTime.UtcNow
            };
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            var paymentUrl = _vnpay.CreatePaymentUrl(appointment.Id, 100000, "Thanh toán đặt lịch hẹn");

            return new BookAppointmentResponse
            {
                AppointmentId = appointment.Id,
                ConsultantId = consultant.Id.ToString(),
                ConsultantName = consultant.Name,
                ConsultantEmail = consultant.Email,
                PaymentUrl = paymentUrl,
                Messsage = "Đặt lịch thành công! Vui lòng thanh toán để hoàn tất đặt lịch."
            };
        }

        public async Task<AppointmentPaymentResultResponse> HandlePaymentCallbackAsync(string appointmentId, string vnpResponseCode)
        {
            var appointment = await _context.Appointments.FirstOrDefaultAsync(a => a.Id == appointmentId);
            if (appointment == null)
                return new AppointmentPaymentResultResponse { Messsage = "Không tìm thấy lịch hẹn." };

            if (vnpResponseCode == "00")
            {
                appointment.Status = "InProcess";
                appointment.Update_at = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return new AppointmentPaymentResultResponse
                {
                    AppointmentId = appointment.Id,
                    Status = appointment.Status,
                    ConsultantName = appointment.ConsultantName,
                    Messsage = "Đặt lịch thành công!"
                };
            }
            else
            {
                appointment.Status = "Pending";
                await _context.SaveChangesAsync();
                return new AppointmentPaymentResultResponse
                {
                    AppointmentId = appointment.Id,
                    Status = appointment.Status,
                    Messsage = "Thanh toán không thành công."
                };
            }
        }
    }
}
