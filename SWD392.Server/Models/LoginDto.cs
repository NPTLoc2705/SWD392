using System.ComponentModel.DataAnnotations;

namespace SWD392.Server.Models
{
    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string email { get; set; }

        [Required]
        public string password { get; set; }
    }
}
