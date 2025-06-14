using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.dtos.Request
{
    public class TicketRequest
    {
        [Required]
        public string Subject { get; set; }

        [Required]
        public string Message { get; set; }
      
    }
}
