using System.ComponentModel.DataAnnotations;

namespace BO.dtos.Request
{
    public class RegisterRequest
    {
        [Required]
        [StringLength(100)]
        [RegularExpression(@"^[\p{L}\p{M}\s]+$", ErrorMessage = "Tên chỉ được chứa chữ cái và khoảng trắng, không chứa ký tự đặc biệt.")]
        public string name { get; set; }

        [Required]
        [StringLength(100)]
        public string password { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        [RegularExpression(@"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$", ErrorMessage = "Email không đúng định dạng.")]
        public string email { get; set; }

        [Phone]
        [StringLength(15)]
        [RegularExpression(@"^(0[3|5|7|8|9])+([0-9]{8})$", ErrorMessage = "Số điện thoại không đúng định dạng Việt Nam.")]
        public string phone { get; set; }
    }
}
