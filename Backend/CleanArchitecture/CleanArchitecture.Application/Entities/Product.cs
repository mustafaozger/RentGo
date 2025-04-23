using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;


namespace CleanArchitecture.Core.Entities
{
    public class Product : AuditableBaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
        public Category Category { get; set; }
        public double PricePerMonth { get; set; }
        public double PricePerWeek { get; set; }
        public bool IsRent { get; set; }= false;
        public bool IsAvailable() => !IsRent;
        public ICollection<ProductImage> ProductImageList { get; set; } = new List<ProductImage>();
        public ICollection<DateTime> ProductRentalHistories { get; set; } = new List<DateTime>();
    }

    [Owned]
    public class ProductImage
    {
        public string ImageUrl { get; set; } = string.Empty;
    }
}
