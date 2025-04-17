using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Features.Products.Commands.UpdateProduct
{
    public class UpdateProductParameter
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double PricePerWeek { get; set; }
        public double PricePerMonth { get; set; }
        public Guid CategoryId { get; set; }
        public List<String> ProductImageList { get; set; }
    }
}