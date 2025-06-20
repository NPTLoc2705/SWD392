using BO.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.dtos.Request
{
    public class ApplicationRequest
    {
        

        [Required]
        public string ProgramId { get; set; }

        [Required]
        public Dictionary<string, object> SubmissionData { get; set; }

    }
    public class UpdateApplicationRequest
    {
        public string StudentName { get; set; }
        public string Student_Phone { get; set; }
        public string ProgramId { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<string, object> SubmissionData { get; set; }

    }
    public class ChangeStatusRequest
    {
        public int StatusValue { get; set; }
    }
}
