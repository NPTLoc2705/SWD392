using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BO.Models
{
    public class ChatHistory
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(1000)]
        public string Message { get; set; }

        [Required]
        [StringLength(4000)]
        public string Response { get; set; }

        [Required]
        public DateTime Timestamp { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } // Assumes existing User model
    }
}