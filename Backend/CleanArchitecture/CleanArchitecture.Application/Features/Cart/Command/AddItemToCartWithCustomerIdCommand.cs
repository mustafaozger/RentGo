using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Core.Entities;
using MediatR;

namespace CleanArchitecture.Application.Features.Cart.Command
{
    public class AddItemToCartWithCustomerIdCommand:IRequest<bool>
    {
        public Guid CustomerId { get; set; }
        public Guid ProductId { get; set; }
        public string RentalPeriodType { get; set; }
        public int RentalDuration { get; set; }
        public double TotalPrice { get; set; } = 0.0;
    }

    public class AddItemToCartWithCustomerIdCommandHandler : IRequestHandler<AddItemToCartWithCustomerIdCommand, bool>
    {
        private readonly ICartRepositoryAsync _cartRepository;

        public AddItemToCartWithCustomerIdCommandHandler(ICartRepositoryAsync cartRepository)
        {
            _cartRepository = cartRepository;
        }

        public async Task<bool> Handle(AddItemToCartWithCustomerIdCommand request, CancellationToken cancellationToken)
        {
            var cart = await _cartRepository.GetCartByCustomerIdAsync(request.CustomerId)
                       ?? throw new KeyNotFoundException("Cart not found");
            var EndRentTime= request.RentalPeriodType.CompareTo("Week") == 0
                ? DateTime.UtcNow.AddDays(request.RentalDuration * 7)
                : DateTime.UtcNow.AddDays(request.RentalDuration * 30);

            var cartItem = new CartItem
            {
                CartItemId       = Guid.NewGuid(),
                CartId           = cart.CartId,
                ProductId        = request.ProductId,
                RentalPeriodType = request.RentalPeriodType,
                RentalDuration   = request.RentalDuration,
                StartRentTime   = DateTime.UtcNow,
                EndRentTime     = EndRentTime,
                TotalPrice      = request.TotalPrice,                                
            };
            var newId = await _cartRepository.AddCartItemAsync(cartItem);

            return newId != Guid.Empty;
        }
    }
}