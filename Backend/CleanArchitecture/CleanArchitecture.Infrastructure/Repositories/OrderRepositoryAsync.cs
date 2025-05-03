using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Application.Interfaces.Repositories;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Infrastructure.Contexts;
using CleanArchitecture.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Infrastructure.Repositories
{
    public class OrderRepositoryAsync : GenericRepositoryAsync<Order>,IOrderRepositoryAsync
    {
          private readonly ApplicationDbContext _context;

        public OrderRepositoryAsync(ApplicationDbContext context):base(context)
        {
            _context = context;
        }

        public async Task<Guid> AddOrderAsync(Order order)
        {
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
            return order.OrderId;
        }

        public async Task<Order> GetOrderByIdAsync(Guid orderId)
        {
            return await _context.Orders
                                 .FirstOrDefaultAsync(o => o.OrderId == orderId);
        }

    }
}