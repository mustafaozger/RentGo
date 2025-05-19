using CleanArchitecture.Application.DTOs.CartDTO;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Infrastructure.Contexts;
using CleanArchitecture.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Moq;
using Shouldly;
using System;
using System.Threading.Tasks;
using Xunit;

namespace CleanArchitecture.UnitTests
{
    public class CartRepositoryAsyncTests
    {
       private async Task<ApplicationDbContext> GetDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            var mockDateTime = new Mock<IDateTimeService>();
            mockDateTime.Setup(x => x.NowUtc).Returns(DateTime.UtcNow);

            var mockUser = new Mock<IAuthenticatedUserService>();
            mockUser.Setup(x => x.UserId).Returns("TestUserId");

            var context = new ApplicationDbContext(options, mockDateTime.Object, mockUser.Object);

            context.Categories.Add(new Category
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Name = "Electronics",
                Description = "Electronic items"
            });

            await context.SaveChangesAsync();

            return context;
        }

        [Fact]
        public async Task AddCartItemAsync_ShouldAddItem()
        {
            var context = await GetDbContext();
            var repo = new CartRepositoryAsync(context);

            var cartItem = new CartItem
            {
                CartItemId = Guid.NewGuid(),
                CartId = Guid.NewGuid(),
                ProductId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                RentalPeriodType = "Week",
                RentalDuration = 2
            };

            var result = await repo.AddCartItemAsync(cartItem);

            result.ShouldBe(cartItem.CartItemId);
        }

        [Fact]
        public async Task GetCartByIdAsync_ShouldReturnCartDto()
        {
            var context = await GetDbContext();

            var cartId = Guid.NewGuid();
            context.Carts.Add(new Cart
            {
                CartId = cartId,
                CustomerId = Guid.NewGuid(),
                CartItemList = new[]
                {
                    new CartItem
                    {
                        CartItemId = Guid.NewGuid(),
                        ProductId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                        RentalPeriodType = "Week",
                        RentalDuration = 1
                    }
                }
            });

            await context.SaveChangesAsync();
            var repo = new CartRepositoryAsync(context);

            var result = await repo.GetCartByIdAsync(cartId);

            result.ShouldNotBeNull();
            result.CartId.ShouldBe(cartId);
            result.Items.Count.ShouldBe(1);
        }

[Fact]
public async Task RemoveCartItemAsync_ShouldRemoveItem()
{
    // Arrange
    var options = new DbContextOptionsBuilder<ApplicationDbContext>()
        .UseInMemoryDatabase(Guid.NewGuid().ToString())
        .Options;

    var mockDateTime = new Mock<IDateTimeService>();
    mockDateTime.Setup(x => x.NowUtc).Returns(DateTime.UtcNow);

    var mockUser = new Mock<IAuthenticatedUserService>();
    mockUser.Setup(x => x.UserId).Returns("TestUserId");

    var context = new ApplicationDbContext(options, mockDateTime.Object, mockUser.Object);

    var cartId = Guid.NewGuid();
    var customerId = Guid.NewGuid();
    var productId = Guid.NewGuid();
    var cartItemId = Guid.NewGuid();

    var product = new Product
    {
        Id = productId,
        Name = "Item",
        Description = "Test Item",
        PricePerWeek = 10,
        PricePerMonth = 30,
        CategoryId = Guid.NewGuid()
    };

    var cartItem = new CartItem
    {
        CartItemId = cartItemId,
        CartId = cartId,
        ProductId = productId,
        RentalDuration = 1,
        RentalPeriodType = "Week",
        TotalPrice = 10,
        StartRentTime = DateTime.Now,
        EndRentTime = DateTime.Now.AddDays(7)
    };

    var cart = new Cart
    {
        CartId = cartId,
        CustomerId = customerId,
        CartItemList = new List<CartItem> { cartItem }
    };

    context.Products.Add(product);
    context.Carts.Add(cart);
    context.CartItem.Add(cartItem);
    await context.SaveChangesAsync();

    var repo = new CartRepositoryAsync(context);

    // Act
    var result = await repo.RemoveCartItemAsync(cartItemId);

    // Assert
    result.ShouldNotBeNull();
    result.Items.ShouldNotContain(i => i.CartItemId == cartItemId);

    var deletedItem = await context.CartItem.FindAsync(cartItemId);
    deletedItem.ShouldBeNull(); // DB'den de gerçekten silinmiş mi kontrolü
}


    [Fact]
public async Task ChangeCartItemCountAsync_ShouldUpdateItem()
{
    // Arrange
    var options = new DbContextOptionsBuilder<ApplicationDbContext>()
        .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
        .Options;

    var mockDateTime = new Mock<IDateTimeService>();
    mockDateTime.Setup(x => x.NowUtc).Returns(DateTime.UtcNow);

    var mockUser = new Mock<IAuthenticatedUserService>();
    mockUser.Setup(x => x.UserId).Returns("TestUserId");

    var context = new ApplicationDbContext(options, mockDateTime.Object, mockUser.Object);

    var customerId = Guid.NewGuid();
    var productId = Guid.NewGuid();
    var cartId = Guid.NewGuid();
    var cartItemId = Guid.NewGuid();

    var product = new Product
    {
        Id = productId,
        Name = "Test Product",
        Description = "A product",
        PricePerWeek = 10,
        PricePerMonth = 30,
        CategoryId = Guid.NewGuid()
    };

    var cart = new Cart
    {
        CartId = cartId,
        CustomerId = customerId,
        CartItemList = new List<CartItem>()
    };

    var cartItem = new CartItem
    {
        CartItemId = cartItemId,
        CartId = cartId,
        ProductId = productId,
        RentalPeriodType = "Week",
        RentalDuration = 1,
        TotalPrice = 10,
        StartRentTime = DateTime.Now,
        EndRentTime = DateTime.Now.AddDays(7)
    };

    context.Products.Add(product);
    context.Carts.Add(cart);
    context.CartItem.Add(cartItem);

    await context.SaveChangesAsync();

    var repo = new CartRepositoryAsync(context);

    // Act
    var result = await repo.ChangeCartItemCountAsync(cartItemId, "Month", 2);

    // Assert
    result.ShouldNotBeNull();
    var updatedItem = result.Items.FirstOrDefault(i => i.CartItemId == cartItemId);
    updatedItem.ShouldNotBeNull();
    updatedItem.RentalPeriodType.ShouldBe("Month");
    updatedItem.RentalDuration.ShouldBe(2);
    updatedItem.TotalPrice.ShouldBe(2 * 30);
}

        [Fact]
        public async Task GetCartByCustomerIdAsync_ShouldReturnCorrectCart()
        {
            var context = await GetDbContext();
            var customerId = Guid.NewGuid();

            context.Carts.Add(new Cart
            {
                CartId = Guid.NewGuid(),
                CustomerId = customerId,
                CartItemList = new[]
                {
                    new CartItem
                    {
                        CartItemId = Guid.NewGuid(),
                        ProductId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                        RentalPeriodType = "Week",
                        RentalDuration = 1
                    }
                }
            });

            await context.SaveChangesAsync();

            var repo = new CartRepositoryAsync(context);
            var result = await repo.GetCartByCustomerIdAsync(customerId);

            result.ShouldNotBeNull();
            result.Items.Count.ShouldBe(1);
        }


    }
}
