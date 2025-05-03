using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.Interfaces.Repositories;
using MediatR;

namespace CleanArchitecture.Application.Features.Orders.Queries
{
    public class GetOrderByIdQuery:IRequest<Core.Entities.Order>
    {
        public Guid OrderId { get; set; }
    }
    public class GetOrderByIdQueryHandler:IRequestHandler<GetOrderByIdQuery,Core.Entities.Order>
    {
        private readonly IOrderRepositoryAsync _orderRepository;

        public GetOrderByIdQueryHandler(IOrderRepositoryAsync orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<Core.Entities.Order> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
        {
            return await _orderRepository.GetOrderByIdAsync(request.OrderId);
        }
    }

}