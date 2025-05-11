using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using CleanArchitecture.Application.Enums;
using Newtonsoft.Json;

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

        public string RentalPeriodType { get; set; } = string.Empty;
        public int RentalDuration { get; set; }

        public double TotalPrice { get; set; } = 0.0;
        public DateTime StartRentTime { get; set; }
        public DateTime EndRentTime { get; set; }

    }

    public class Cart
    {
        [Key]
        public Guid CartId { get; set; }
        public Guid CustomerId { get; set; }
        [JsonIgnore]
        public Customer Customer { get; set; }
        public ICollection<CartItem> CartItemList { get; set; } = new List<CartItem>();
    }
}
