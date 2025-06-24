using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.Models
{
    public enum ApplicationStatus
    {
        Draft,         // Application saved but not submitted
        Submitted,     // Successfully submitted (default)
        UnderReview,   // Being reviewed by admissions
        Approved,     // Accepted into the program
        Rejected,     // Denied admission
        Waitlisted,   // Potential admission if spots open
        Withdrawn     // Student withdrew the application
    }
}
