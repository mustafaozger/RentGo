using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.Interfaces.Repositories;
using MediatR;

namespace CleanArchitecture.Application.Features.Orders.Command
{
    public class UpdateOrderStatusCommand: IRequest<Guid>
    {
        public Guid OrderId { get; set; }
        public string Status { get; set; }
    }

    public class UpdateOrderStatusCommandHandler : IRequestHandler<UpdateOrderStatusCommand, Guid>
    {
        private readonly IOrderRepositoryAsync _orderRepository;

        public UpdateOrderStatusCommandHandler(IOrderRepositoryAsync orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<Guid> Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
        {
            return await _orderRepository.UpdateOrderStatusAsync(request.OrderId, request.Status);
        }
    }
        
}