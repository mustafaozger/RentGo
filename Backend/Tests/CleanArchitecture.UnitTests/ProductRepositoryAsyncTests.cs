using CleanArchitecture.Application.Features.Categories;
using CleanArchitecture.Application.Features.Products;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Features.Products.Queries.GetAllProducts;
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
    public class ProductRepositoryAsyncTests
    {
        private async Task<ApplicationDbContext> GetDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var mockDateTime = new Mock<IDateTimeService>();
            mockDateTime.Setup(x => x.NowUtc).Returns(DateTime.UtcNow);

            var mockUser = new Mock<IAuthenticatedUserService>();
            mockUser.Setup(x => x.UserId).Returns("TestUserId");

            var context = new ApplicationDbContext(options, mockDateTime.Object, mockUser.Object);

            // Seed data
            context.Categories.Add(new Category
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Name = "Electronics"
            });

            context.Products.AddRange(
                new Product
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    Name = "Laptop",
                    CategoryId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    PricePerWeek = 50,
                    PricePerMonth = 200
                },
                new Product
                {
                    Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    Name = "Phone",
                    CategoryId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    PricePerWeek = 20,
                    PricePerMonth = 80
                });

            await context.SaveChangesAsync();

            return context;
        }


        [Fact]
        public async Task GetProductById_ShouldReturnCorrectProduct()
        {
            var context = await GetDbContext();
            var repo = new ProductRepositoryAsync(context);

            var product = await repo.GetProductById(Guid.Parse("11111111-1111-1111-1111-111111111111"));

            product.ShouldNotBeNull();
            product.Name.ShouldBe("Laptop");
        }



        [Fact]
        public async Task GetAllProductsByCategoryName_ShouldReturnFilteredProducts()
        {
            var context = await GetDbContext();
            var repo = new ProductRepositoryAsync(context);

            var parameter = new GetAllProductsByCategoryNameParameter
            {
                categoryName = "Electronics",
                PageNumber = 1,
                PageSize = 10
            };

            var products = await repo.GetAllProductsByCategoryName(parameter);

            products.Data.ShouldNotBeEmpty();
            products.Data.ShouldContain(p => p.Name == "Laptop");
        }

        [Fact]
        public async Task GetAllProductsByName_ShouldReturnFilteredProducts()
        {
            var context = await GetDbContext();
            var repo = new ProductRepositoryAsync(context);

            var parameter = new GetAllProductsByNameParameter
            {
                productName = "Phone",
                PageNumber = 1,
                PageSize = 10
            };

            var products = await repo.GetAllProductsByName(parameter);

            products.Data.ShouldHaveSingleItem();
            products.Data.ShouldContain(p => p.Name == "Phone");
        }

        [Fact]
        public async Task GetProductByName_ShouldReturnMatchingProducts()
        {
            var context = await GetDbContext();
            var repo = new ProductRepositoryAsync(context);

            var result = await repo.GetProductByName("Lap");

            result.Data.ShouldNotBeEmpty();
            result.Data.ShouldContain(p => p.Name == "Laptop");
        }

        [Fact]
        public async Task GetAllProductsByCategoryId_ShouldReturnCorrectProducts()
        {
            var context = await GetDbContext();
            var repo = new ProductRepositoryAsync(context);

            var parameter = new GetAllProductsByCategoryIdParameter
            {
                CategoryId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                PageNumber = 1,
                PageSize = 5
            };

            var products = await repo.GetAllProductsByCategoryId(parameter);

            products.Data.ShouldNotBeEmpty();
            products.Data.ShouldContain(p => p.CategoryId == parameter.CategoryId);
        }



    }
}
