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
        [ForeignKey("Ticket")]
        public string ticket_id { get; set; }
        public Tickets Ticket { get; set; }
        [Required]
        [ForeignKey("User")]
        public int student_id { get; set; }
        public User Student { get; set; }

        [Required]
        [ForeignKey("User")]
        public int consultant_id { get; set; }
        public User Consultant { get; set; }

        [Required]
        [Range(1, 5)]
        public int rating { get; set; }

        public string comment { get; set; }

        public string? response { get; set; }

        [Required]
        public bool resolved { get; set; } = false;

        [Required]
        public DateTime created_at { get; set; } = DateTime.UtcNow;
    }
}