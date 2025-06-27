using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BO.Models
{
    public class Programs
    {
        [Key]
        public string id { get; set; }

        [Required]
        [StringLength(200)]
        public string title { get; set; }

        [Required]
        public string description { get; set; }

        [Required]
        
        public string admission_requirements { get; set; } 

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal? tuition_fee { get; set; } // Changed to decimal type

        public string dormitory_info { get; set; }

        public bool is_active { get; set; } = true;

        public DateTime created_at { get; set; } = DateTime.UtcNow;

        public DateTime? updated_at { get; set; }

        // Navigation property
        public ICollection<Applications> Applications { get; set; }

        public Programs()
        {
            id = Guid.NewGuid().ToString("N");
        }
    }
}
