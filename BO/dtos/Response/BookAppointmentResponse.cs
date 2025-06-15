using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.dtos.Response
{
    public class BookAppointmentResponse
    {
        public string AppointmentId { get; set; }
        public string PaymentUrl { get; set; }
        public string ConsultantId { get; set; }
        public string ConsultantName { get; set; }
        public string ConsultantEmail { get; set; }
        public string Messsage { get; set; }
    }
}
