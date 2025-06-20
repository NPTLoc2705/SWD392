using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.dtos.Response
{
    public class ProgramResponse
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string AdmissionRequirements { get; set; }
        public decimal? TuitionFee { get; set; }
        public string DormitoryInfo { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int error { get; set; }
        public string? message { get; set; }
    }
}
