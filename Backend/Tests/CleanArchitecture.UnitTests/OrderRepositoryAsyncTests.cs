using CleanArchitecture.Core.Entities;
using CleanArchitecture.Application.Entities;
using CleanArchitecture.Infrastructure.Contexts;
using CleanArchitecture.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using CleanArchitecture.Core.Interfaces;
using Moq;

namespace CleanArchitecture.UnitTests
{
    public class OrderRepositoryAsyncTests
    {
        private async Task<ApplicationDbContext> GetDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            var mockDateTime = new Mock<IDateTimeService>();
            mockDateTime.Setup(x => x.NowUtc).Returns(DateTime.UtcNow);

            var mockUser = new Mock<IAuthenticatedUserService>();
            mockUser.Setup(x => x.UserId).Returns("TestUser");

            var context = new ApplicationDbContext(options, mockDateTime.Object, mockUser.Object);

            // Seed Data
            var customerId = Guid.NewGuid();
            context.Customers.Add(new Customer { Id = customerId, Name = "Test Customer" });

            var product = new Product
            {
                Id = Guid.NewGuid(),
                Name = "Test Product",
                Description = "Test Description",
                PricePerMonth = 100,
                PricePerWeek = 30,
                QuantityInStock = 10,
                ActiveRentedProductQuantity = 2,
                UsageStatus = CleanArchitecture.Application.Enums.UsageStatus.New
            };

            context.Products.Add(product);

            var order = new Order
            {
                OrderId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                CustomerId = customerId,
                OrderStatus = "Pending",
                RentalProducts = new[]
                {
                    new RentalProduct
                    {
                        RentalItemId = Guid.NewGuid(),
                        ProductId = product.Id,
                        ProductName = product.Name,
                        Description = product.Description,
                        PricePerMonth = product.PricePerMonth,
                        PricePerWeek = product.PricePerWeek,
                        RentalDuration = 2,
                        RentalPeriodType = "Week",
                        StartRentTime = DateTime.Now,
                        EndRentTime = DateTime.Now.AddDays(14),
                        TotalPrice = 60
                    }
                },
                RentInfo = new RentInfo
                {
                    RentId = Guid.NewGuid(),
                    ReciverAddress = "Test Address",
                    ReciverName = "Test Name",
                    ReciverPhone = "123456789",
                }
            };

            context.Orders.Add(order);

            await context.SaveChangesAsync();
            return context;
        }

        [Fact]
        public async Task AddOrderAsync_ShouldAddSuccessfully()
        {
            var context = await GetDbContext();
            var repo = new OrderRepositoryAsync(context);

            var order = new Order
            {
                OrderId = Guid.NewGuid(),
                CustomerId = context.Customers.First().Id,
                OrderStatus = "Confirmed",
                RentalProducts = new[]
                {
                    new RentalProduct
                    {
                        RentalItemId = Guid.NewGuid(),
                        ProductId = context.Products.First().Id,
                        ProductName = "Added Product",
                        Description = "Added Description",
                        PricePerMonth = 120,
                        PricePerWeek = 40,
                        RentalDuration = 1,
                        RentalPeriodType = "Month",
                        StartRentTime = DateTime.Now,
                        EndRentTime = DateTime.Now.AddMonths(1),
                        TotalPrice = 120
                    }
                },
                RentInfo = new RentInfo
                {
                    RentId = Guid.NewGuid(),
                    ReciverAddress = "Test Address",
                    ReciverName = "Test Name",
                    ReciverPhone = "123456789",
                }
            };

            var result = await repo.AddOrderAsync(order);
            result.ShouldBe(order.OrderId);
        }

        [Fact]
        public async Task GetOrderByIdAsync_ShouldReturnCorrectOrder()
        {
            var context = await GetDbContext();
            var repo = new OrderRepositoryAsync(context);

            var order = await repo.GetOrderByIdAsync(Guid.Parse("11111111-1111-1111-1111-111111111111"));

            order.ShouldNotBeNull();
            order.Customer.ShouldNotBeNull();
            order.RentalProducts.ShouldNotBeEmpty();
            order.RentInfo.ShouldNotBeNull();

            var rentalProduct = order.RentalProducts.First();
            rentalProduct.ProductName.ShouldBe("Test Product");
            rentalProduct.PricePerWeek.ShouldBe(30);
        }

        [Fact]
        public async Task GetAllOrdersAsync_ShouldReturnAllOrders()
        {
            var context = await GetDbContext();
            var repo = new OrderRepositoryAsync(context);

            var orders = await repo.GetAllOrdersAsync();
            orders.ShouldNotBeEmpty();
        }

        [Fact]
        public async Task GetOrdersByCustomerIdAsync_ShouldReturnCorrectOrder()
        {
            var context = await GetDbContext();
            var repo = new OrderRepositoryAsync(context);
            var customerId = context.Customers.First().Id;

            var order = await repo.GetOrdersByCustomerIdAsync(customerId);
            order.ShouldNotBeNull();
            order.CustomerId.ShouldBe(customerId);
        }

        [Fact]
        public async Task GetOrdersByStatusAsync_ShouldReturnMatchingOrders()
        {
            var context = await GetDbContext();
            var repo = new OrderRepositoryAsync(context);

            var orders = await repo.GetOrdersByStatusAsync("Pending");
            orders.ShouldNotBeEmpty();
            orders.ShouldAllBe(o => o.OrderStatus == "Pending");
        }

        [Fact]
        public async Task UpdateOrderStatusAsync_ShouldUpdateCorrectly()
        {
            var context = await GetDbContext();
            var repo = new OrderRepositoryAsync(context);
            var orderId = Guid.Parse("11111111-1111-1111-1111-111111111111");

            var updatedId = await repo.UpdateOrderStatusAsync(orderId, "Completed");
            updatedId.ShouldBe(orderId);

            var updatedOrder = await context.Orders.FindAsync(orderId);
            updatedOrder.OrderStatus.ShouldBe("Completed");
        }
    }
}
