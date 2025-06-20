using System.ComponentModel.DataAnnotations;

namespace BO.dtos.Request
{
    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        [RegularExpression(@"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$", ErrorMessage = "Email không đúng định dạng.")]
        public string email { get; set; }

        [Required]
        public string password { get; set; }
    }
}
