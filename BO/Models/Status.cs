﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.Models
{
    public enum Status
    {
        Pending,    // Default status when created
        Assigned,   // When consultant is assigned
        Answered,   // When consultant responds
        Cancelled,  // When ticket is cancelled
        Completed   // When ticket is resolved
    }
}
