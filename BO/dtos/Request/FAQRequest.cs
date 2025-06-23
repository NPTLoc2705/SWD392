using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.ComponentModel.DataAnnotations;

namespace BO.dtos.Request
{
    public class FAQRequest
    {
        [Required]
        public string Question { get; set; }
        [Required]
        public string Answer { get; set; }
        
    }
}