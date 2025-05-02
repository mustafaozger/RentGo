using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.Application.Entities;

namespace CleanArchitecture.Core.Entities
{
    public class Order
    {
        [Key]
        public Guid OrderId { get; set; }
        public Guid CustomerId { get; set; }
        public double TotalCost { get; set; }
        public string OrderStatus { get; set; } = "Pending";
        public Customer Customer { get; set; }
        public RentInfo RentInfo { get; set; }
        public Guid RentInfoID { get; set; }
        public virtual ICollection<RentalProduct> RentalProducts { get; set; }= new List<RentalProduct>();

        public DateTime OrderDate { get; set; }
    }

}
