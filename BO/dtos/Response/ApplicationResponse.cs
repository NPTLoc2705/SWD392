﻿using BO.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace BO.dtos.Response
{
    public class ApplicationResponse
    {
        public string Id { get; set; }
        public int StudentId { get; set; }
        public string StudentName { get; set; }
        public string StudentPhone { get; set; }
        public string ProgramId { get; set; }
        public string ProgramTitle { get; set; } // Added for convenience
        public string ImageUrl { get; set; }
        public List<string> DocumentUrls { get; set; }
        public string PortfolioLink { get; set; }
        public string OtherLink { get; set; }
        public DateTime SubmittedAt { get; set; }
        public string StatusName => Status.ToString();
        public ApplicationStatus Status { get; set; }

        public int ErrorCode { get; set; }
        public string Message { get; set; }
    }
}
