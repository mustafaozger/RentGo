using System;
using System.Collections.Generic;

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
        public bool IsRent { get; set; }
        public bool IsAvailable() => !IsRent;
        public List<string> ProductImageList { get; set; } = new List<string>();
        public List<DateTime> ProductRentalHistories { get; set; } = new List<DateTime>();
    }
}
