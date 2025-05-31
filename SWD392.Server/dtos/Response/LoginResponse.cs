using SWD392.Server.Models;

namespace SWD392.Server.dtos.Response
{
    public class LoginResponse
    {
        public string token { get; set; }
        public User user { get; set; }
    }
}
