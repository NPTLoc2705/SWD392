using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.dtos.Request
{
    public class CreateProgramRequest
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string AdmissionRequirements { get; set; }
        [Required]
        public decimal TuitionFee { get; set; }

        public string DormitoryInfo { get; set; }
        [Required]
        public bool IsActive { get; set; }

       
    }
    public class UpdateProgramRequest
    {

        [StringLength(200)]
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string AdmissionRequirements { get; set; }
        public decimal? TuitionFee { get; set; }  // Nullable decimal
        public string? DormitoryInfo { get; set; }
        public bool IsActive { get; set; }


    }
}
