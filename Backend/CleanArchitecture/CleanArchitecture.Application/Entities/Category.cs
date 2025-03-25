using System.Collections.Generic;
using System;

namespace CleanArchitecture.Core.Entities
{
    public class Category : AuditableBaseEntity
    {
       
            public Guid CategoryId { get; set; }
            public string CategoryName { get; set; } = string.Empty;
            public string CategoryIcon { get; set; } = string.Empty;

            public virtual ICollection<Category> CategoryList { get; set; }
     

    }
}
