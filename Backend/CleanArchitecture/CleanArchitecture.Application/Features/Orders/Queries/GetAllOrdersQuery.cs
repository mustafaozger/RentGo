
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.Interfaces.Repositories;
using CleanArchitecture.Core.Entities;
using MediatR;

namespace CleanArchitecture.Application.Features.Order.Queries
{
    public class GetAllOrdersQuery:IRequest<IEnumerable<Core.Entities.Order>>
    {
    }

    public class GettAllOrdersQueryHandler:IRequestHandler<GetAllOrdersQuery,IEnumerable<Core.Entities.Order>>
    {
        private readonly IOrderRepositoryAsync _orderRepository;

        public GettAllOrdersQueryHandler(IOrderRepositoryAsync orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<IEnumerable<Core.Entities.Order>> Handle(GetAllOrdersQuery request, CancellationToken cancellationToken)
        {
            return await _orderRepository.GetAllAsync();
        }
    }
}