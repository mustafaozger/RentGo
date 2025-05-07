using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Application.Enums;

namespace CleanArchitecture.Application.DTOs.CartDTOs
{
 public class CartItemDto
    {
        public Guid CartItemId { get; set; }
        public Guid ProductId { get; set; }
        public string RentalPeriodType { get; set; }
        public int RentalDuration { get; set; }
        public double TotalPrice { get; set; } = 0.0;
        public DateTime StartRentTime { get; set; }
        public DateTime EndRentTime { get; set; }
    }
}