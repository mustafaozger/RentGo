    using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Entities
{
    public class CartItem
    {
        public Guid CartItemId { get; set; } 

        public Guid CartId { get; set; }
        public Cart Cart { get; set; } 
        public Guid ProductId { get; set; }
        public Product? Product { get; set; }
        public int Quantity { get; set; }
    }

}
