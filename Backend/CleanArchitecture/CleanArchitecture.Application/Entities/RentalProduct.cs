using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Core.Entities;

namespace CleanArchitecture.Application.Entities
{
    public class RentalProduct
    {
         [Key]
        public Guid RentalItemId { get; set; }
        public Guid OrderID { get; set; }
        public Order Order { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public double PricePerMonth { get; set; }
        public double PricePerWeek { get; set; }
        public int RentalDuration { get; set; }
        public string RentalPeriodType { get; set; }
        public DateTime ProductRentalHistories { get; set; }
    }
}