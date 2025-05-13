using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace CleanArchitecture.Core.Entities
{
    public class Customer : User
    {
        public Guid CartId { get; set; }
        public Cart Cart { get; set; } = new();
        [JsonIgnore]
        public virtual ICollection<Order> OrderHistory { get; set; }
    }

}
