﻿using System.ComponentModel.DataAnnotations;

namespace SWD392.Server.Models
{
    public class RegisterDto
    {
        [Required]
        [StringLength(100)]
        public string name { get; set; }

        [Required]
        [StringLength(100)]
        public string password { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string email { get; set; }

        [Phone]
        [StringLength(15)]
        public string phone { get; set; }
    }
}
