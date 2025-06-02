using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BO.Models
{
    public class Payments
    {
        [Key]
        public string Id { get; set; }
        public Payments()
        {
            if (string.IsNullOrEmpty(Id))
                Id = Guid.NewGuid().ToString("N");
        }

        [Required]
        public int UserId { get; set; }

        [MaxLength(50)]
        public string? AppointmentId { get; set; } // Khớp với kiểu string của Appointments.Id

        [Required]
        [Column(TypeName = "decimal(12,2)")]
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(10)]
        public string Currency { get; set; } = "VND";

        [Required]
        [MaxLength(100)]
        public string Purpose { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Pending"; // Pending, Success, Failed

        [MaxLength(100)]
        public string? VnpTxnRef { get; set; }

        [MaxLength(10)]
        public string? VnpResponseCode { get; set; }

        public string? VnpOrderInfo { get; set; }

        public DateTime? VnpPayDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [ForeignKey("AppointmentId")]
        public virtual Appointments? Appointment { get; set; }
    }
}