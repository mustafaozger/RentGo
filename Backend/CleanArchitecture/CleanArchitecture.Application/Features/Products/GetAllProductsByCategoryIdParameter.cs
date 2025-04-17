using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Core.Filters;

namespace CleanArchitecture.Application.Features.Products
{
    public class GetAllProductsByCategoryIdParameter:RequestParameter
    {
        public Guid CategoryId { get; set; }
    }
}