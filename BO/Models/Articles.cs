using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BO.Models
{
    public class Articles
    {
        [Key]
        public string id { get; set; }

        public Articles()
        {
            if (string.IsNullOrEmpty(id))
                id = Guid.NewGuid().ToString("N");
        }

        [Required]
        public string title { get; set; }

        [Required]
        public byte[] image { get; set; }

        [Required]
        public string content { get; set; }

        [Required]
        [ForeignKey("User")]
        public int published_by { get; set; } 

        public User User { get; set; }

        [Required]
        public DateTime created_at { get; set; }

        [Required]
        public DateTime updated_at { get; set; }
    }
}