using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;

namespace SWD392.Server.Models
{
    public class User
    {
        public string id { get; set; }
        public User()
        {
            if (string.IsNullOrEmpty(id))
                id = Guid.NewGuid().ToString("N");
        }

        [Required]
        [StringLength(100)]
        [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "Name must not contain special characters.")]
        public string name { get; set; }

        [Required]
        [StringLength(100)]
        [JsonIgnore] // Prevent password from being returned in API responses
        public string password { get; set; }

        [Required]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        [StringLength(100)]
        public string email { get; set; }

        [Phone]
        [StringLength(10)]
        [RegularExpression(@"^(0|\+84)[0-9]{9}$", ErrorMessage = "Invalid phone number format.")]
        public string phone { get; set; }

        [Required]
        public DateTime create_at { get; set; }
        public bool is_active { get; set; }

        // Foreign key
        public int RoleId { get; set; }

        // Navigation properties for appointments
        public ICollection<Appointments> StudentAppointments { get; set; }
        public ICollection<Appointments> ConsultantAppointments { get; set; }
        public ICollection<Applications> Applications { get; set; }
        public ICollection<Articles> Articles { get; set; }
        public ICollection<Email_verifications> Email_verifications { get; set; }
        public ICollection<Payments> Payments { get; set; }
        public ICollection<Feedback> StudentFeedbacks { get; set; }
        public ICollection<Feedback> ConsultantFeedbacks { get; set; }

    }
}