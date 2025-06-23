using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.Models
{
    public class FAQ
    {
        public int Id { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }

        [ForeignKey("User")]
        public int Userid { get; set; }
        public User User { get; set; }
    }
}
