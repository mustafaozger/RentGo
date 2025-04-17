using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Core.Filters;

namespace CleanArchitecture.Application.Features.Categories
{
    public class GetAllProductsByCategoryNameParameter:RequestParameter
    {
        public String categoryName { get; set; }
    }
}