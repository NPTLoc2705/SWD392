using System.ComponentModel.DataAnnotations;

namespace BO.Models
{
    public class Role
    {
        public int id { get; set; }

        [Required]
        [StringLength(100)]
        public string name { get; set; }

        // Navigation property: One Role has many Users
        public ICollection<User> Users { get; set; }
    }
}
