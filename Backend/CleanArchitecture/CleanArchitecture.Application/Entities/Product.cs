using System.Collections.Generic;
using System;

namespace CleanArchitecture.Core.Entities
{
    public class Product : AuditableBaseEntity
    {

        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
        
       public virtual ICollection<Product> Products { get; set; }
        public double PricePerMonth { get; set; }
        public double PricePerWeek { get; set; }
        public bool IsRent { get; set; }
        public DateTime LastRentalHistory { get; set; }

        public bool IsAvailable() => !IsRent;
    }


    //Database Modified
}
