using CleanArchitecture.Application.DTOs.CartDTO;
using CleanArchitecture.Application.DTOs.CartDTOs;
using CleanArchitecture.Application.Enums;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Infrastructure.Contexts;
using CleanArchitecture.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
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
        public async Task<Guid> AddCartItemAsync(CartItem cartItem)
        {
            await _context.Set<CartItem>().AddAsync(cartItem);
            await _context.SaveChangesAsync();
            return cartItem.CartItemId;
        }

        public async Task<CartDto> GetCartByIdAsync(Guid cartId)
        {
            return await _context.Carts
                .Where(c => c.CartId == cartId)
                .Select(c => new CartDto
                {
                    CartId = c.CartId,
                    Items = c.CartItemList
                              .Select(ci => new CartItemDto
                              {
                                  CartItemId = ci.CartItemId,
                                  ProductId = ci.ProductId,
                                  RentalPeriodType = ci.RentalPeriodType,
                                  RentalDuration = ci.RentalDuration
                              })
                              .ToList()
                })
                .FirstOrDefaultAsync();
        }

        public async Task<CartDto> RemoveCartItemAsync(Guid cartItemId)
        {
            var ci = await _context.CartItem.FindAsync(cartItemId);
            if (ci == null) return null;

            var cartId = ci.CartId;
            _context.CartItem.Remove(ci);
            await _context.SaveChangesAsync();
            return await GetCartByIdAsync(cartId);
        }

          public async Task<CartDto> ChangeCartItemCountAsync(Guid cartItemId,RentalPeriodType rentalPeriodType,int newRentalDuration)
        {
            var ci = await _context.CartItem.FindAsync(cartItemId);
            if (ci == null) return null;

            ci.RentalPeriodType = rentalPeriodType;
            ci.RentalDuration   = newRentalDuration;

            _context.CartItem.Update(ci);
            await _context.SaveChangesAsync();

            return await GetCartByIdAsync(ci.CartId);
        }
    }
}
