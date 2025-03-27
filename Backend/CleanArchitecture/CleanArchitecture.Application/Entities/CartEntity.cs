using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Entities
{
    public class Cart
    {
        [Key]
        public Guid CartId { get; set; }
        public Guid CustomerId { get; set; }
        public Customer Customer { get; set; }
        public virtual ICollection<CartItem> CartItemList { get; set; }
    }

}
