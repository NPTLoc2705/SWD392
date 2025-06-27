using BO.Models;
using Microsoft.AspNetCore.Http;
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
        [Required(ErrorMessage = "ProgramId is required")]
        public string ProgramId { get; set; }

        public string? PortfolioLink { get; set; }

        public string? OtherLink { get; set; }

        // For single image upload
        public IFormFile? Image { get; set; }

        // For multiple document uploads
        public List<IFormFile>? Documents { get; set; }
    }
    public class UpdateApplicationRequest
    {
        public string StudentName { get; set; }
        public string Student_Phone { get; set; }
        public string ProgramId { get; set; }

        // For single image upload
        public IFormFile? Image { get; set; }

        // Alternative for multiple documents
        public IFormFileCollection? Documents { get; set; }
        public string? PortfolioLink { get; set; }
        public string? OtherLink { get; set; }

    }
    public class ChangeStatusRequest
    {
        public int StatusValue { get; set; }
    }
}
