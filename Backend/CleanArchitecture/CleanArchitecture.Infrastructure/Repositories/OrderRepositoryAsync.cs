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
    public class OrderRepositoryAsync : GenericRepositoryAsync<Order>, IOrderRepositoryAsync
    {
        private readonly ApplicationDbContext _context;

        public OrderRepositoryAsync(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Guid> AddOrderAsync(Order order)
        {
            // _context.ChangeTracker.TrackGraph(order, e => e.Entry.State = EntityState.Added);
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order.OrderId;
        }

        public Task<IEnumerable<Order>> GetAllOrdersAsync()
        {
            var orders = _context.Orders
                .Include(o => o.RentalProducts)
                .Include(o => o.Customer)
                .Include(o => o.RentInfo)
                .AsQueryable();

            return Task.FromResult(orders.AsEnumerable());
        }


        public async Task<Order> GetOrderByIdAsync(Guid orderId)
        {
            var order = await _context.Orders
                .Include(o => o.RentalProducts)
                .Include(o => o.Customer)
                .Include(o => o.RentInfo)

                .FirstOrDefaultAsync(o => o.OrderId == orderId);
            /*

                        return await _context.Orders
                                             .FirstOrDefaultAsync(o => o.OrderId == orderId);
            */
            return order;
        }

        public Task<Order> GetOrdersByCustomerIdAsync(Guid customerId)
        {
            var order = _context.Orders
                .Where(o => o.CustomerId == customerId)
                .Include(o => o.RentalProducts)
                .Include(o => o.Customer)
                .Include(o => o.RentInfo)

                .AsQueryable();
            return Task.FromResult(order.FirstOrDefault());
        }

        public Task<IEnumerable<Order>> GetOrdersByStatusAsync(string status)
        {
            var orders = _context.Orders
                .Where(o => o.OrderStatus == status)
                .Include(o => o.RentalProducts)
                .Include(o => o.Customer)
                .Include(o => o.RentInfo)

                .AsQueryable();

            return Task.FromResult(orders.AsEnumerable());
        }

        public async Task<Guid> UpdateOrderStatusAsync(Guid orderId, string status)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
                throw new Exception("Order not found");


            order.OrderStatus = status;
            _context.Orders.Update(order);
            _context.SaveChanges();
            return orderId;
        }
    }
}