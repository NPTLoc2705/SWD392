using BO.Models;

namespace BO.dtos.Response
{
    public class LoginResponse
    {
        public string token { get; set; }
        public Student user { get; set; }
    }
}
