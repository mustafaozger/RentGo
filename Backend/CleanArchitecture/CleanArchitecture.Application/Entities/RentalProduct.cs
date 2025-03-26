using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Core.Entities;

namespace CleanArchitecture.Application.Entities
{
    public class RentalProduct
    {
    public Guid RentalItemId { get; set; }

    public Guid RentalId { get; set; }
    public Order Order { get; set; }
    public Guid OrderID { get; set; }
    public Guid ProductId { get; set; } // for refeer to orginal product
    public string ProductName { get; set; }
    public string Description { get; set; }
    public double UnitPrice { get; set; }
    public int Quantity { get; set; }

    }
}