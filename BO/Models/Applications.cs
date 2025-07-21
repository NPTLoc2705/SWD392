using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace BO.Models
{
    public class Applications
    {
        [Key]
        public string id { get; set; }
        public Applications()
        {
            if (string.IsNullOrEmpty(id))
                id = Guid.NewGuid().ToString("N");
        }

        [ForeignKey("User")]
        public int student_id { get; set; }
        public string student_name { get; set; }
        public string MyPhone { get; set; }
        public User Student { get; set; }

        [ForeignKey("Programs")]
        public string programs_id { get; set; }
        public Programs Programs { get; set; }

        public string ImagePath { get; set; }
        [Column(TypeName = "text")]
        public string DocumentPaths { get; set; } 
        public string PortfolioLink { get; set; }
        public string OtherLink { get; set; }

        [Required]
        public DateTime submitted_at { get; set; }
        [Required]
        [Column(TypeName = "varchar(20)")] // Stores enum as string in database
        public ApplicationStatus Status { get; set; }

        [Required]
        public DateTime updated_at { get; set; } = DateTime.UtcNow;
    }
}