using BO.Models;

namespace BO.dtos.Response
{
    public class LoginResponse
    {
        public string token { get; set; }
        public User user { get; set; }
    }
}
