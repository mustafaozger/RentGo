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
        public RentalPeriodType RentalPeriodType { get; set; }
        public int RentalDuration { get; set; }
    }
}