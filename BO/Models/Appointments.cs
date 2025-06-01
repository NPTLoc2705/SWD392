using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BO.Models
{
    public class Appointments
    {
        [Key]
        public string id { get; set; }
        public Appointments()
        {
            if (string.IsNullOrEmpty(id))
                id = Guid.NewGuid().ToString("N");
        }

        // Khóa ngoại đến User (Student)
        [ForeignKey("Student")]
        public string student_id { get; set; }
        public User Student { get; set; }

        // Khóa ngoại đến User (Consultant)
        [ForeignKey("Consultant")]
        public string consultant_id { get; set; }
        public User Consultant { get; set; }

        [Required]
        [StringLength(50)]
        public string status { get; set; }

        [Required]
        public DateTime create_at { get; set; }

        [Required]
        public DateTime update_at { get; set; }
    }
}
