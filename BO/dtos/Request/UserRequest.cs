using BO.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace BO.dtos.Request
{
    public class UserRequest
    {
      
        public string Name { get; set; }


        [StringLength(100)]
        public string Password { get; set; }

        [EmailAddress]
        [StringLength(100)]
        [RegularExpression(@"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$", ErrorMessage = "Email không đúng định dạng.")]

        public string Email { get; set; }

        [Phone]
        [StringLength(10)]
        [RegularExpression(@"^(0[3|5|7|8|9])+([0-9]{8})$", ErrorMessage = "Số điện thoại không đúng định dạng Việt Nam.")]

        public string Phone { get; set; }
    }
}
