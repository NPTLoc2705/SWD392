using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.dtos.Request
{
    public class FeedbackRequest
    {
        [Required]
        public string ticket_id { get; set; }

        

        [Required]
        [Range(1, 5)]
        public int rating { get; set; }

        public string comment { get; set; }
    }
    public class FeedbackRatingRequest
    {
        [Required]
        [Range(1, 5)]
        public int rating { get; set; }

        public string comment { get; set; }
    }
}
