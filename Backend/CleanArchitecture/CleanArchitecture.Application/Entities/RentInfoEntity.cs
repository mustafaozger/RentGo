using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Entities
{
    public class RentInfo
    {
        public Guid RentId { get; set; }
        public DateTime StartRentDate { get; set; }
        public DateTime EndRentDate { get; set; }
        public string RentalTime { get; set; } = string.Empty;
    }

}
