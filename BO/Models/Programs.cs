using System.ComponentModel.DataAnnotations;

namespace SWD392.Server.Models
{
    public class Programs
    {
        [Key]
        public string id { get; set; }
        public Programs()
        {
            if (string.IsNullOrEmpty(id))
                id = Guid.NewGuid().ToString("N");
        }

        [Required]
        public string title { get; set; }

        [Required]
        public string description { get; set; }

        [Required]
        public string admission_requirements { get; set; }

        [Required]
        public string tuition_fee { get; set; }

        public string dormitory_info { get; set; }
        public ICollection<Applications> Applications { get; set; }

    }
}
