using System.ComponentModel.DataAnnotations;

namespace SWD392.Server.Models
{
    public class GoogleAuthDto
    {
        [Required]
        public string IdToken { get; set; }
    }
}
