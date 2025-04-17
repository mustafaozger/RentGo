using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.Interfaces;

namespace CleanArchitecture.Application.Features.Carts.Commands.RemoveItemFromCart
{
    public class RemoveItemFromCartCommand : IRequest<bool>
    {
        public Guid CartId { get; set; }
        public Guid ProductId { get; set; }
    }

    public class RemoveItemFromCartCommandHandler : IRequestHandler<RemoveItemFromCartCommand, bool>
    {
        private readonly ICartRepositoryAsync _cartRepository;

        public RemoveItemFromCartCommandHandler(ICartRepositoryAsync cartRepository)
        {
            _cartRepository = cartRepository;
        }

        public async Task<bool> Handle(RemoveItemFromCartCommand request, CancellationToken cancellationToken)
        {
            var cart = await _cartRepository.GetCartWithItemsAsync(request.CartId);

            if (cart == null) return false;

            var item = cart.CartItemList.FirstOrDefault(x => x.ProductId == request.ProductId);
            if (item == null) return false;

            cart.CartItemList.Remove(item);
            await _cartRepository.UpdateAsync(cart);
            return true;
        }
    }
}
