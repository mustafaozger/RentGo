using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Interfaces
{
    public interface ICartRepositoryAsync:IGenericRepositoryAsync<Cart>
    {
      Task<Cart> GetCartWithItemsAsync(Guid cartId);
      Task<Guid> AddCartItemAsync(CartItem cartItem);

    }
}
