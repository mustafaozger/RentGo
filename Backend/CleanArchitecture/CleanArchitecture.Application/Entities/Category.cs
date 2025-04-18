﻿using System.Collections.Generic;
using System;
using System.ComponentModel.DataAnnotations;

namespace CleanArchitecture.Core.Entities
{
    public class Category 
    {
            [Key]
            public Guid Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public string Description { get; set; } = string.Empty;
            public string CategoryIcon { get; set; } = string.Empty;

            public ICollection<Product> Products { get; set; }            
    }
}
