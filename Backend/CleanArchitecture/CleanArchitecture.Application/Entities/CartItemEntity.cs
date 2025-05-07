using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using CleanArchitecture.Application.Enums;

namespace CleanArchitecture.Core.Entities
{
  
    public class CartItem
    {
        [Key]
        public Guid CartItemId { get; set; }

        public Guid CartId { get; set; }
        public Cart Cart { get; set; }

        public Guid ProductId { get; set; }
        public Product Product { get; set; }

        public RentalPeriodType RentalPeriodType { get; set; } =RentalPeriodType.Week;
        public int RentalDuration { get; set; }
    }

    public class Cart
    {
        [Key]
        public Guid CartId { get; set; }
        public Guid CustomerId { get; set; }
        public Customer Customer { get; set; }
        public ICollection<CartItem> CartItemList { get; set; } = new List<CartItem>();
    }
}
