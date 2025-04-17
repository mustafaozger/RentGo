using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Core.Entities;

namespace CleanArchitecture.Application.Features.Carts.Commands.AddItemToCart
{
    public class AddItemToCartCommand : IRequest<Guid>
    {
        public Guid CartId { get; set; }
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
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
            var cart = await _cartRepository.GetCartWithItemsAsync(request.CartId);

            if (cart == null) throw new Exception("Cart not found");

            var cartItem = new CartItem
            {
                CartId = request.CartId,
                ProductId = request.ProductId,
                Quantity = request.Quantity
            };

            cart.CartItemList.Add(cartItem);
            await _cartRepository.UpdateAsync(cart);

            return cartItem.ProductId;
        }
    }
}
