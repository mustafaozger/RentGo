using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Core.Entities;
using MediatR;

namespace CleanArchitecture.Application.Features.Carts.Queries.GetAllCarts
{
    public class GetAllCartsQuery : IRequest<IEnumerable<Cart>>
    {
    }

    public class GetAllCartsQueryHandler : IRequestHandler<GetAllCartsQuery, IEnumerable<Cart>>
    {
        private readonly ICartRepositoryAsync _cartRepository;

        public GetAllCartsQueryHandler(ICartRepositoryAsync cartRepository)
        {
            _cartRepository = cartRepository;
        }

        public async Task<IEnumerable<Cart>> Handle(GetAllCartsQuery request, CancellationToken cancellationToken)
        {
            return await _cartRepository.GetAllAsync();
        }
    }
}
