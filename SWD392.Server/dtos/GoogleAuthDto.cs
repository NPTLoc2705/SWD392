using System.ComponentModel.DataAnnotations;

namespace SWD392.Server.dtos
{
    public class GoogleAuthDto
    {
        [Required]
        public string IdToken { get; set; }
    }
}
