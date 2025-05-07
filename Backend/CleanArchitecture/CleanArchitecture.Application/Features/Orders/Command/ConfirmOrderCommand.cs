using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Interfaces.Repositories;
using MediatR;

namespace CleanArchitecture.Application.Features.Order.Command
{

    public class ConfirmOrderCommand : IRequest<Guid>
    {
        public Guid CartId { get; set; }

        // RentInfo için ekstra alanlar
        public DateTime StartRentDate { get; set; }
        public DateTime EndRentDate { get; set; }
        public string RentalTime { get; set; }
    }
  public class ConfirmOrderCommandHandler : IRequestHandler<ConfirmOrderCommand, Guid>
    {
        private readonly ICartRepositoryAsync _cartRepository;
        private readonly IOrderRepositoryAsync _orderRepository;

        public ConfirmOrderCommandHandler(
            ICartRepositoryAsync cartRepository,
            IOrderRepositoryAsync orderRepository)
        {
            _cartRepository = cartRepository;
            _orderRepository = orderRepository;
        }

        public async Task<Guid> Handle(ConfirmOrderCommand request, CancellationToken cancellationToken)
        {
            // 1. Sepeti yükle
            var cart = await _cartRepository.GetByIdAsync(request.CartId)
                        ?? throw new KeyNotFoundException("Cart not found");

            // 2. Yeni sipariş nesnesi
            var order = new Core.Entities.Order
            {
                OrderId = Guid.NewGuid(),
                CustomerId = cart.CustomerId,
                OrderDate = DateTime.UtcNow,
                RentInfo = new Core.Entities.RentInfo
                {
                    RentId = Guid.NewGuid(),
                    StartRentDate = request.StartRentDate,
                    EndRentDate = request.EndRentDate,
                    RentalTime = request.RentalTime
                }
            };

            foreach (var ci in cart.CartItemList)
            {
                order.RentalProducts.Add(new Entities.RentalProduct
                {
                    RentalItemId = Guid.NewGuid(),
                    OrderID = order.OrderId,
                    ProductId = ci.ProductId,
                    ProductName = ci.Product?.Name ?? string.Empty,
                    Description = ci.Product?.Description ?? string.Empty,
                    PricePerMonth = ci.Product?.PricePerMonth ?? 0,
                    PricePerWeek = ci.Product?.PricePerWeek ?? 0,
                    RentalDuration = ci.RentalDuration,
                    RentalPeriodType = ci.RentalPeriodType,
                    ProductRentalHistories = DateTime.UtcNow
                });
            }

            var newOrderId = await _orderRepository.AddOrderAsync(order);
            await _cartRepository.DeleteAsync(cart);

            return newOrderId;
        }


    }

}