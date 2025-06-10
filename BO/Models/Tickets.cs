using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BO.Models
{
    public class Tickets
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString("N");

        [Required]
        [ForeignKey("User")]
        public int StudentId { get; set; }  
        public User Student { get; set; }      

        [ForeignKey("User")]
        public int? ConsultantId { get; set; } 
        public User? Consultant { get; set; }

        [Required]
        public Status Status { get; set; } = Status.Pending;

        [Required]
        public string Subject { get; set; }

        [Required]
        public string Message { get; set; }

        [Required]
        public DateTime created_at { get; set; } = DateTime.UtcNow;

        [Required]
        public DateTime updated_at { get; set; } = DateTime.UtcNow;
    }
}
