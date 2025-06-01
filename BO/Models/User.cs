using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;

namespace BO.Models
{
    public class User
    {
        public int id { get; set; }

        [Required]
        [StringLength(100)]
        public string name { get; set; }

        [Required]
        [StringLength(100)]
        [JsonIgnore]
        public string password { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string email { get; set; }

        [Phone]
        [StringLength(15)]
        public string phone { get; set; }

        // Foreign Key
        public int RoleId { get; set; }

        // Navigation property
        [JsonIgnore]
        public Role Role { get; set; }

        // Navigation properties for appointments
        //public ICollection<Appointments> StudentAppointments { get; set; }
        //public ICollection<Appointments> ConsultantAppointments { get; set; }
        //public ICollection<Applications> Applications { get; set; }
        //public ICollection<Articles> Articles { get; set; }
        //public ICollection<Email_verifications> Email_verifications { get; set; }
        //public ICollection<Payments> Payments { get; set; }
        //public ICollection<Feedback> StudentFeedbacks { get; set; }
        //public ICollection<Feedback> ConsultantFeedbacks { get; set; }

    }
}