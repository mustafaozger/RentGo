using System;
using System.ComponentModel.DataAnnotations;

namespace CleanArchitecture.Core.DTOs.Account
{
    public class UserDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
    }
}
