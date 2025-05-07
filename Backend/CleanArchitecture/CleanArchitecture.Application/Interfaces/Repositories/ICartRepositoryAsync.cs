using CleanArchitecture.Application.DTOs.CartDTO;
using CleanArchitecture.Application.Enums;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Interfaces
{
    public interface ICartRepositoryAsync:IGenericRepositoryAsync<Cart>
    {
      Task<CartDto> GetCartByIdAsync(Guid cartId);
      Task<Guid> AddCartItemAsync(CartItem cartItem);
      Task<CartDto> RemoveCartItemAsync(Guid cartItemId);
      Task<CartDto> ChangeCartItemCountAsync(Guid cartItemId,string rentalPeriodType,int newRentalDuration);    
    }
}
