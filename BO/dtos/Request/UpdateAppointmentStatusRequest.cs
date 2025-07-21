using BO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.dtos.Request
{
    public class UpdateAppointmentStatusRequest
    {
        public AppointmentStatus Status { get; set; }
    }
}
