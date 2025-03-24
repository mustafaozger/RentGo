using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Entities
{
    public class Order
    {
        public Guid OrderId { get; set; }
        public Guid ProductId { get; set; }
        public Product? Product { get; set; }

        public Cart? Cart { get; set; }
        public Guid CustomerId { get; set; }

        public double TotalCost { get; set; }
        public string OrderStatus { get; set; } = "Pending";
    }

}
