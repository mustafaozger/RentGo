using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Infrastructure.Contexts;
using CleanArchitecture.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Repositories
{
    public class CartRepositoryAsync : GenericRepositoryAsync<Cart>,ICartRepositoryAsync
    {
        private readonly ApplicationDbContext _context;

        public CartRepositoryAsync(ApplicationDbContext context):base(context)
        {
            _context = context;
        }

    
        public async Task DeleteAsync(Guid id)
        {
            var cart = await _context.Carts.FindAsync(id);
            if (cart != null)
            {
                _context.Carts.Remove(cart);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Cart> GetCartWithItemsAsync(Guid cartId)
        {
            return await _context.Carts
                                 .Include(c => c.CartItemList)
                                 .FirstOrDefaultAsync(c => c.CartId == cartId);
        }
        public async Task<Guid> AddCartItemAsync(CartItem cartItem)
        {
            await _context.Set<CartItem>().AddAsync(cartItem);
            await _context.SaveChangesAsync();
            return cartItem.CartItemId;
        }

    }
}
