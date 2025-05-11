using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace CleanArchitecture.Core.Entities
{
    public class RentInfo
    {
        [Key]
        public Guid RentId { get; set; }
        public string ReciverName { get; set; }=string.Empty;
        public string ReciverPhone { get; set; }=string.Empty;
        public string ReciverAddress { get; set; }=string.Empty;
        [JsonIgnore]
        public Order Order { get; set; }
    }

}
