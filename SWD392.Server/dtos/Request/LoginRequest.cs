using System.ComponentModel.DataAnnotations;

namespace SWD392.Server.dtos.Request
{
    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string email { get; set; }

        [Required]
        public string password { get; set; }
    }
}
