using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BO.Models
{
    public class Tickets
    {
        [Key]
        public string id { get; set; }
        public Tickets()
        {
            if (string.IsNullOrEmpty(id))
                id = Guid.NewGuid().ToString("N");
        }

        [ForeignKey("Student")]
        public string student_id { get; set; }
        public User Student { get; set; }

        [ForeignKey("Consultant")]
        public string consultant_id { get; set; }
        public User Consultant { get; set; }

        [Required]
        public string subject { get; set; }

        [Required]
        public string status { get; set; }

        [Required]
        public DateTime created_at { get; set; }

        [Required]
        public DateTime updated_at { get; set; }
    }
}
