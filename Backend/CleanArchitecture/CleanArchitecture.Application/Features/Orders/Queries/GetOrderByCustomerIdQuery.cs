using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.Interfaces.Repositories;
using MediatR;

namespace CleanArchitecture.Application.Features.Orders.Queries
{
    public class GetOrderByCustomerIdQuery:IRequest<Core.Entities.Order>
    {
        public Guid CustomerId { get; set; }
    }
    public class GetOrderByCustomerIdHandler : IRequestHandler<GetOrderByCustomerIdQuery, Core.Entities.Order>
    {
        private readonly IOrderRepositoryAsync _orderRepository;

        public GetOrderByCustomerIdHandler(IOrderRepositoryAsync orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<Core.Entities.Order> Handle(GetOrderByCustomerIdQuery request, CancellationToken cancellationToken)
        {
            return await _orderRepository.GetOrdersByCustomerIdAsync(request.CustomerId);
        }


    }

}