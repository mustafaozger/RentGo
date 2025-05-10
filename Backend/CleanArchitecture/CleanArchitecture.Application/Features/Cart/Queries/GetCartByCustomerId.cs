using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.DTOs.CartDTO;
using CleanArchitecture.Application.Interfaces;
using MediatR;

namespace CleanArchitecture.Application.Features.Cart.Queries
{
    public class GetCartByCustomerId:IRequest<CartDto>
    {
        public Guid CustomerId { get; set; }
    }
    
    public class GetCartByCustomerIdHandler : IRequestHandler<GetCartByCustomerId, CartDto>
    {
        private readonly ICartRepositoryAsync _cartRepository;

        public GetCartByCustomerIdHandler(ICartRepositoryAsync cartRepository)
        {
            _cartRepository = cartRepository;
        }

        public async Task<CartDto> Handle(GetCartByCustomerId request, CancellationToken cancellationToken)
        {
            return await _cartRepository.GetCartByCustomerIdAsync(request.CustomerId);
        }

    }
}