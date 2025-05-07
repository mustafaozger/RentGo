using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Core.Entities;
using MediatR;

namespace CleanArchitecture.Application.Features.Carts.Commands.CreateCart
{
    public class CreateCartCommand : IRequest<Guid>
    {
        public Guid CustomerId { get; set; }
    }

    public class CreateCartCommandHandler : IRequestHandler<CreateCartCommand, Guid>
    {
        private readonly ICartRepositoryAsync _cartRepository;

        public CreateCartCommandHandler(ICartRepositoryAsync cartRepository)
        {
            _cartRepository = cartRepository;
        }

        public async Task<Guid> Handle(CreateCartCommand request, CancellationToken cancellationToken)
        {
            var cart = new Core.Entities.Cart
            {
                CartId = Guid.NewGuid(),
                CustomerId = request.CustomerId,
                CartItemList = new List<CartItem>()
            };

            try{
            await _cartRepository.AddAsync(cart);
            }catch(Exception e ){
                Console.WriteLine(e.Message);
                Console.ReadLine();
            }


            return cart.CartId;
        }
    }
}
