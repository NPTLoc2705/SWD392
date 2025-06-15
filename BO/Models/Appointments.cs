using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BO.Models
{
    public class Appointments
    {
        [Key]
        public int Id { get; set; }

        // Khóa ngoại đến User (Student)
        [ForeignKey("Student")]
        public int StudentId { get; set; }
        public User Student { get; set; }

        [Required]
        [StringLength(100)]
        public string StudentName { get; set; }

        // Khóa ngoại đến User (Consultant)
        [ForeignKey("Consultant")]
        public int ConsultantId { get; set; }
        public User Consultant { get; set; }

        [Required]
        [StringLength(100)]
        public string ConsultantName { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; }

        public bool IsPriority { get; set; }
        public int QueuePosition { get; set; }

        [Required]
        public DateTime Create_at { get; set; }

        [Required]
        public DateTime Update_at { get; set; }
        public virtual ICollection<Payments> Payments { get; set; }
    }
}
