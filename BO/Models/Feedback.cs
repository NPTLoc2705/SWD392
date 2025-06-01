using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BO.Models
{
    public class Feedback
    {
        [Key]
        public string id { get; set; }
        public Feedback()
        {
            if (string.IsNullOrEmpty(id))
                id = Guid.NewGuid().ToString("N");
        }

        [Required]
        [ForeignKey("Student")]
        public string student_id { get; set; }
        public User Student { get; set; }

        [Required]
        [ForeignKey("Consultant")]
        public string consultant_id { get; set; }
        public User Consultant { get; set; }

        [Required]
        public int rating { get; set; }

        public string comment { get; set; }

        public string response { get; set; }

        [Required]
        public bool resolved { get; set; }

        [Required]
        public DateTime created_at { get; set; }
    }
}