using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Application.Interfaces;
using System.Collections.Generic;

namespace CleanArchitecture.Application.Features.Carts.Commands.AddItemToCart
{
    public class AddItemToCartCommand : IRequest<Guid>
    {
        public Guid CartId { get; set; }
        public Guid ProductId { get; set; }
        public RentalPeriodType RentalPeriodType { get; set; }
        public int RentalDuration { get; set; }
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
        // 1. Ensure the cart exists (optional: you might skip loading items if not needed)
        var cart = await _cartRepository.GetCartWithItemsAsync(request.CartId)
                   ?? throw new KeyNotFoundException("Cart not found");

        // 2. Create the new CartItem
        var cartItem = new CartItem
        {
            CartItemId       = Guid.NewGuid(),
            CartId           = request.CartId,
            ProductId        = request.ProductId,
            RentalPeriodType = request.RentalPeriodType,
            RentalDuration   = request.RentalDuration
        };

        // 3. Delegate to the repository
        var newId = await _cartRepository.AddCartItemAsync(cartItem);

        return newId;
    }
}

}