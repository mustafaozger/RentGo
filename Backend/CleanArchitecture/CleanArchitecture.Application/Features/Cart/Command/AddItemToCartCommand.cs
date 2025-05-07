using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Application.Interfaces;
using System.Collections.Generic;
using CleanArchitecture.Application.Enums;

namespace CleanArchitecture.Application.Features.Carts.Commands.AddItemToCart
{
    public class AddItemToCartCommand : IRequest<Guid>
    {
        public Guid CartId { get; set; }
        public Guid ProductId { get; set; }
        public string RentalPeriodType { get; set; }
        public int RentalDuration { get; set; }
        public double TotalPrice { get; set; } = 0.0;
    }

   public class AddItemToCartCommandHandler : IRequestHandler<AddItemToCartCommand, Guid>
{
    private readonly ICartRepositoryAsync _cartRepository;

    public AddItemToCartCommandHandler(ICartRepositoryAsync cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task<Guid> Handle(AddItemToCartCommand request, CancellationToken cancellationToken)
    {
        var cart = await _cartRepository.GetCartByIdAsync(request.CartId)
                   ?? throw new KeyNotFoundException("Cart not found");

        var EndRentTime= request.RentalPeriodType.CompareTo("Week") == 0
            ? DateTime.UtcNow.AddDays(request.RentalDuration * 7)
            : DateTime.UtcNow.AddDays(request.RentalDuration * 30);

        var cartItem = new CartItem
        {
            CartItemId       = Guid.NewGuid(),
            CartId           = request.CartId,
            ProductId        = request.ProductId,
            RentalPeriodType = request.RentalPeriodType,
            RentalDuration   = request.RentalDuration,
            StartRentTime   = DateTime.UtcNow,
            EndRentTime     = EndRentTime,
            TotalPrice      = request.TotalPrice,                                
        };
        // 3. Delegate to the repository
        var newId = await _cartRepository.AddCartItemAsync(cartItem);

        return newId;
    }
}

}