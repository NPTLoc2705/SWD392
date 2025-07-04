﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Text.Json.Serialization;

namespace BO.dtos.Request
{
    public class BookAppointmentRequest
    {
        [JsonIgnore]
        public int StudentId { get; set; }
        public string StudentName { get; set; }
        public string Phone { get; set; }
        public bool IsPriority { get; set; }
    }
}
