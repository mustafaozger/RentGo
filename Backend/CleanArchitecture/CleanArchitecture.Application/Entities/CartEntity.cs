using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Entities
{
    public class Cart
    {
        public Guid CartId { get; set; }
        public Guid CustomerId { get; set; }
        public List<CartItem> CartList { get; set; } = new();
    }

}
