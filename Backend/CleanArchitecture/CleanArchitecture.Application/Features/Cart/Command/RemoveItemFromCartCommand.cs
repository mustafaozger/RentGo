using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.DTOs.CartDTO;

namespace CleanArchitecture.Application.Features.Carts.Commands.RemoveItemFromCart
{
    public class RemoveCartItemCommand :IRequest<CartDto>
    {
        public Guid CartItemId { get; set; }
    }

    public class RemoveCartItemCommandHandler : IRequestHandler<RemoveCartItemCommand, CartDto>
    {
        private readonly ICartRepositoryAsync _repo;

        public RemoveCartItemCommandHandler(ICartRepositoryAsync repo)
        {
            _repo = repo;
        }

        public Task<CartDto> Handle(RemoveCartItemCommand request, CancellationToken cancellationToken)
            => _repo.RemoveCartItemAsync(request.CartItemId);
    }

}
