using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.dtos.Response
{
    public class AppointmentPaymentResultResponse
    {
        public string AppointmentId { get; set; }
        public string Phone { get; set; }
        public string ConsultantName { get; set; }
        public string Status { get; set; }
        public string Messsage { get; set; }
    }
}
