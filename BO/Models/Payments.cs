using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SWD392.Server.Models
{
    public class Payments
    {
        [Key]
        public string id { get; set; }
        public Payments()
        {
            if (string.IsNullOrEmpty(id))
                id = Guid.NewGuid().ToString("N");
        }

        [Required]
        [ForeignKey("User")]
        public string user_id { get; set; }
        public User User { get; set; }

        [Required]
        [Column(TypeName = "decimal(12,2)")]
        public decimal amount { get; set; }

        [Required]
        [StringLength(10)]
        public string currency { get; set; }

        [Required]
        [StringLength(100)]
        public string purpose { get; set; }

        [Required]
        [StringLength(50)]
        public string status { get; set; }

        [StringLength(100)]
        public string vnp_txn_ref { get; set; }

        [StringLength(10)]
        public string vnp_response_code { get; set; }

        public string vnp_order_info { get; set; }

        public DateTime? vnp_pay_date { get; set; }

        [Required]
        public DateTime created_at { get; set; }
    }
}