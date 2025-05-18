using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SWD392.Server.Models
{
    public class Student
    {
        public int id { get; set; }

        [Required]
        [StringLength(100)]
        public string name { get; set; }

        [Required]
        [StringLength(100)]
        [JsonIgnore] // Prevent password from being returned in API responses
        public string password { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string email { get; set; }

        [Phone]
        [StringLength(15)]
        public string phone { get; set; }
    }
}