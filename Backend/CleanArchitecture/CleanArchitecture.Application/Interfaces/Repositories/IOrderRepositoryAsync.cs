using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Interfaces;

namespace CleanArchitecture.Application.Interfaces.Repositories
{
    public interface IOrderRepositoryAsync:IGenericRepositoryAsync<Order>
    {
        Task<Guid> AddOrderAsync(Order order);
        Task<Order> GetOrderByIdAsync(Guid orderId);
    }
}