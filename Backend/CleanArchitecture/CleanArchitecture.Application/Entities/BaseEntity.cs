using System.ComponentModel.DataAnnotations;

namespace CleanArchitecture.Core.Entities
{
    public abstract class BaseEntity
    {
        [Key]
        public virtual int Id { get; set; }
    }
}
