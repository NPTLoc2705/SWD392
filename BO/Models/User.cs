using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;

namespace BO.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        [RegularExpression(@"^[\p{L}\p{M}\s]+$", ErrorMessage = "Tên chỉ được chứa chữ cái và khoảng trắng, không chứa ký tự đặc biệt.")]
        public string Name { get; set; }

        [Required]
        [StringLength(100)]        
        public string Password { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        [RegularExpression(@"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$", ErrorMessage = "Email không đúng định dạng.")]

        public string Email { get; set; }

        [Phone]
        [StringLength(10)]
        [RegularExpression(@"^(0[3|5|7|8|9])+([0-9]{8})$", ErrorMessage = "Số điện thoại không đúng định dạng Việt Nam.")]

        public string Phone { get; set; }

        // Foreign Key
        public int RoleId { get; set; }

        // Navigation property
        [JsonIgnore]
        public Role Role { get; set; }

        public bool IsBanned {  get; set; }

        // Navigation properties for appointments
        //public ICollection<Appointments> StudentAppointments { get; set; }
        //public ICollection<Appointments> ConsultantAppointments { get; set; }
        //public ICollection<Applications> Applications { get; set; }
        public ICollection<Articles> Articles { get; set; }
        //public ICollection<Email_verifications> Email_verifications { get; set; }
        //public ICollection<Feedback> StudentFeedbacks { get; set; }
        public virtual ICollection<Payments> Payments { get; set; }
        //public ICollection<Feedback> ConsultantFeedbacks { get; set; }

    }
}