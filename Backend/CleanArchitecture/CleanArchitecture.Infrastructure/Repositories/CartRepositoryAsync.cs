using CleanArchitecture.Application.DTOs.CartDTO;
using CleanArchitecture.Application.DTOs.CartDTOs;
using CleanArchitecture.Application.Enums;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Infrastructure.Contexts;
using CleanArchitecture.Infrastructure.Migrations;
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
                    CustomerId = c.CustomerId,
                    Items = c.CartItemList
                              .Select(ci => new CartItemDto
                              {
                                  CartItemId = ci.CartItemId,
                                  ProductId = ci.ProductId,
                                  RentalPeriodType = ci.RentalPeriodType,
                                  RentalDuration = ci.RentalDuration,
                                  TotalPrice = ci.TotalPrice,
                                  StartRentTime = ci.StartRentTime,
                                  EndRentTime = ci.EndRentTime
                                  
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

          public async Task<CartDto> ChangeCartItemCountAsync(Guid cartItemId,string rentalPeriodType,int newRentalDuration)
        {
            var ci = await _context.CartItem.FindAsync(cartItemId);
            var product = await _context.Products.FindAsync(ci.ProductId);

            if (ci == null) return null;

            ci.RentalPeriodType = rentalPeriodType;
            ci.RentalDuration   = newRentalDuration;
            ci.StartRentTime= DateTime.Now;
            ci.EndRentTime= rentalPeriodType.CompareTo("Week")==0 ? DateTime.Now.AddDays(newRentalDuration*7) : DateTime.Now.AddDays(newRentalDuration*30);
            ci.TotalPrice = rentalPeriodType.CompareTo("Week")==0 ? (newRentalDuration * 7 * product.PricePerWeek) : (newRentalDuration *product.PricePerMonth);
            _context.CartItem.Update(ci);
            await _context.SaveChangesAsync();

            return await GetCartByIdAsync(ci.CartId);
        }

        public Task<IEnumerable<Cart>> GetAllCartAsync()
        {
            
            return Task.FromResult(_context.Carts
                .Include(c => c.CartItemList)
                .Select(c => new Cart
                {
                    CartId = c.CartId,
                    CustomerId = c.CustomerId,
                  //  Customer= _context.Customers.FirstOrDefault(cu => cu.Id == c.CustomerId),
                    CartItemList = c.CartItemList.Select(ci => new CartItem
                    {
                        CartId= c.CartId,
                        CartItemId = ci.CartItemId,
                        ProductId = ci.ProductId,
                        Product = _context.Products.FirstOrDefault(p => p.Id == ci.ProductId),
                        RentalPeriodType = ci.RentalPeriodType,
                        RentalDuration = ci.RentalDuration,
                        TotalPrice = ci.TotalPrice,
                        StartRentTime = ci.StartRentTime,
                        EndRentTime = ci.EndRentTime
                    }).ToList()
                }).AsEnumerable());

            
        }

        public Task<CartDto> GetCartByCustomerIdAsync(Guid customerId)
        {
            return _context.Carts
                .Where(c => c.CustomerId == customerId)
                .Select(c => new CartDto
                {
                    CartId = c.CartId,
                    Items = c.CartItemList
                              .Select(ci => new CartItemDto
                              {
                                  CartItemId = ci.CartItemId,
                                  ProductId = ci.ProductId,
                                  RentalPeriodType = ci.RentalPeriodType,
                                  RentalDuration = ci.RentalDuration,
                                  TotalPrice = ci.TotalPrice,
                                  StartRentTime = ci.StartRentTime,
                                  EndRentTime = ci.EndRentTime
                              })
                              .ToList()
                })
                .FirstOrDefaultAsync();
        }

        public Task DeleteCartItemsInCartAsync(Guid cartId)
        {
            var cartItems = _context.CartItem.Where(ci => ci.CartId == cartId);
            if (cartItems != null)
            {
                _context.CartItem.RemoveRange(cartItems);
                return _context.SaveChangesAsync();
            }
            else
            {
                throw new Exception("No Cart Items Found");
            }
        }
    }
}
