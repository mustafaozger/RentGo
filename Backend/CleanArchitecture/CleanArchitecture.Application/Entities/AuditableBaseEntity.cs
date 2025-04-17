using System;
using System.ComponentModel.DataAnnotations;

namespace CleanArchitecture.Core.Entities
{
    public abstract class AuditableBaseEntity
    {
        [Key]
        public virtual Guid Id { get; set; }
        public string CreatedBy { get; set; }
        public DateTime Created { get; set; }
        public string LastModifiedBy { get; set; }
        public DateTime? LastModified { get; set; }
    }
}
