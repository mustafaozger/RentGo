using System;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Core.Entities;
using MediatR;

namespace CleanArchitecture.Application.Features.Carts.Queries.GetCartById
{
    public class GetCartByIdQuery : IRequest<Cart>
    {
        public Guid CartId { get; set; }
    }

    public class GetCartByIdQueryHandler : IRequestHandler<GetCartByIdQuery, Cart>
    {
        private readonly ICartRepositoryAsync _cartRepository;

        public GetCartByIdQueryHandler(ICartRepositoryAsync cartRepository)
        {
            _cartRepository = cartRepository;
        }

        public async Task<Cart> Handle(GetCartByIdQuery request, CancellationToken cancellationToken)
        {
            return await _cartRepository.GetByIdAsync(request.CartId);
        }
    }
}
