using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace SWD392.Server.Models
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

        [ForeignKey("Student")]
        public string student_id { get; set; }
        public User Student { get; set; }

        [ForeignKey("Programs")]
        public string programs_id { get; set; }
        public Programs Programs { get; set; }

        // Lưu dữ liệu JSON, dùng JsonDocument hoặc string tùy nhu cầu
        [Column(TypeName = "jsonb")]
        public string submission_data { get; set; }

        [Required]
        public DateTime submitted_at { get; set; }
    }
}