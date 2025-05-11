using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.Interfaces.Repositories;
using MediatR;

namespace CleanArchitecture.Application.Features.Orders.Queries
{
    public class GetOrdersByStatusQuery:IRequest<IEnumerable<Core.Entities.Order>>
    {
        public string Status { get; set; }
    }
    public class GetOrdersByStatusQueryHandler : IRequestHandler<GetOrdersByStatusQuery, IEnumerable<Core.Entities.Order>>
    {
        private readonly IOrderRepositoryAsync _orderRepository;

        public GetOrdersByStatusQueryHandler(IOrderRepositoryAsync orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<IEnumerable<Core.Entities.Order>> Handle(GetOrdersByStatusQuery request, CancellationToken cancellationToken)
        {
            return await _orderRepository.GetOrdersByStatusAsync(request.Status);
        }
    }

}