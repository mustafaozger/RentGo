using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Application.DTOs.CartDTOs;

namespace CleanArchitecture.Application.DTOs.CartDTO
{
  public class CartDto
    {
        public Guid CartId { get; set; }
        public List<CartItemDto> Items { get; set; } = new();
    }
}