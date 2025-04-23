using System;
using System.Collections.Generic;
using CleanArchitecture.Core.Entities;

namespace CleanArchitecture.Core.Features.Products.Queries.GetAllProducts
{
    public class GetAllProductsViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
        public double PricePerMonth { get; set; }
        public double PricePerWeek { get; set; }
        public bool IsRent { get; set; }
        public DateTime LastRentalHistory { get; set; }
        public bool IsAvailable() => !IsRent;
        public ICollection<ProductImage> ProductImageList { get; set; }

    }
}
