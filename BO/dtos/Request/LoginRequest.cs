using System.ComponentModel.DataAnnotations;

namespace BO.dtos.Request
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
