using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.DTOs.CartDTO;
using CleanArchitecture.Application.Enums;
using CleanArchitecture.Application.Interfaces;
using MediatR;

namespace CleanArchitecture.Application.Features.Cart.Command
{
    public class ChangeCartItemCountCommand: IRequest<CartDto>
    {
        public Guid CartItemId { get; set; }
        public RentalPeriodType RentalPeriodType { get; set; }
        public int NewRentalDuration { get; set; }
    }

     public class ChangeCartItemCountCommandHandler : IRequestHandler<ChangeCartItemCountCommand, CartDto>
    {
        private readonly ICartRepositoryAsync _repo;

        public ChangeCartItemCountCommandHandler(ICartRepositoryAsync repo)
        {
            _repo = repo;
        }

        public Task<CartDto> Handle(ChangeCartItemCountCommand request, CancellationToken cancellationToken)
            => _repo.ChangeCartItemCountAsync(
                   request.CartItemId,
                   request.RentalPeriodType,
                   request.NewRentalDuration
               );
    }
}