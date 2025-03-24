using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Entities
{
    public class Customer : User
    {
        public Cart Cart { get; set; } = new();
        public List<Order> OrderHistory { get; set; } = new();
    }

}
