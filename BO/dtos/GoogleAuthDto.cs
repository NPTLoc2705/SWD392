using System.ComponentModel.DataAnnotations;

namespace BO.dtos
{
    public class GoogleAuthDto
    {
        [Required]
        public string IdToken { get; set; }
    }
}
