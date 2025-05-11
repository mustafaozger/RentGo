using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Interfaces.Repositories;
using CleanArchitecture.Core.Entities;
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
        private readonly IProductRepositotyAsync _productRepository;
        

        public ConfirmOrderCommandHandler(
            ICartRepositoryAsync cartRepository,
            IOrderRepositoryAsync orderRepository,
            IProductRepositotyAsync productRepository)
        {
            _productRepository= productRepository;
            _cartRepository = cartRepository;
            _orderRepository = orderRepository;
        }

        public async Task<Guid> Handle(ConfirmOrderCommand request, CancellationToken cancellationToken)
        {
            var cart = await _cartRepository.GetCartByIdAsync(request.CartId)
                        ?? throw new KeyNotFoundException("Cart not found");

            var rentInfo = new RentInfo
            {
                RentId = Guid.NewGuid(),
                StartRentDate = request.StartRentDate,
                EndRentDate = request.EndRentDate,
                RentalTime = request.RentalTime
            };
            var order = new Core.Entities.Order
            {
                OrderId = Guid.NewGuid(),
                CustomerId = cart.CustomerId,
                OrderDate = DateTime.UtcNow,
                RentInfo = rentInfo,
                TotalCost = cart.Items.Sum(ci => ci.TotalPrice),
            };

            foreach (var ci in cart.Items)
            {
                var product=_productRepository.GetProductById(ci.ProductId);
                order.RentalProducts.Add(new Entities.RentalProduct
                {
                    RentalItemId = Guid.NewGuid(),
                    OrderID = order.OrderId,
                    ProductId = ci.ProductId,
                    ProductName = product.Result.Name ?? string.Empty,
                    Description = product.Result.Description ?? string.Empty,
                    PricePerMonth = product.Result.PricePerMonth,
                    PricePerWeek = product.Result.PricePerWeek,
                    RentalDuration = ci.RentalDuration,
                    RentalPeriodType = ci.RentalPeriodType,
                    ProductRentalHistories = DateTime.UtcNow,
                    StartRentTime = ci.StartRentTime,
                    EndRentTime = ci.EndRentTime,
                    TotalPrice= ci.TotalPrice
                });
            }

            var newOrderId = await _orderRepository.AddOrderAsync(order);

            foreach (var ci in cart.Items)
            {
                await _cartRepository.RemoveCartItemAsync(ci.CartItemId);
            }
 //           await _cartRepository.DeleteAsync(cart);

            return newOrderId;
        }


    }

}