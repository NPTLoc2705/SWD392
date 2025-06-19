using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.dtos.Response
{
    public class FeedbackResponse
    {
        public string id { get; set; }
        public string ticket_id { get; set; }
        public string student_name { get; set; }
        public string consultant_name { get; set; }
        public int rating { get; set; }
        public string comment { get; set; }
        public string response { get; set; }
        public DateTime created_at { get; set; }
    }
    public class FeedbackResponseRequest
    {
        [Required]
        public string response { get; set; }
    }
}
