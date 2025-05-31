using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SWD392.Server.Models
{
    public class Email_verifications
    {
        [Key]
        public string id { get; set; }
        public Email_verifications()
        {
            if (string.IsNullOrEmpty(id))
                id = Guid.NewGuid().ToString("N");
        }

        [Required]
        [ForeignKey("User")]
        public string userid { get; set; }
        public User User { get; set; }

        [Required]
        public string verification_code { get; set; }

        [Required]
        public bool is_verified { get; set; }

        [Required]
        public DateTime sent_at { get; set; }
    }
}