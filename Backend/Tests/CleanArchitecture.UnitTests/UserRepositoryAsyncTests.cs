using CleanArchitecture.Core.Entities;
using CleanArchitecture.Infrastructure.Contexts;
using CleanArchitecture.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using System;
using System.Threading.Tasks;
using Xunit;

namespace CleanArchitecture.UnitTests

{
    public class UserRepositoryAsyncTests
    {
        private async Task<ApplicationDbContext> GetDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            var context = new ApplicationDbContext(options);

            context.Customers.Add(new Customer
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Email = "testuser@example.com",
                Name = "Test User"
            });

            await context.SaveChangesAsync();
            return context;
        }

        [Fact]
        public async Task GetById_ShouldReturnUser()
        {
            var context = await GetDbContext();
            var repo = new UserRepositoryAsync(context);

            var user = await repo.GetById(Guid.Parse("11111111-1111-1111-1111-111111111111"));

            user.ShouldNotBeNull();
            user.Email.ShouldBe("testuser@example.com");
        }

        [Fact]
        public async Task DeleteAccount_ShouldDeleteUser()
        {
            var context = await GetDbContext();
            var repo = new UserRepositoryAsync(context);

            var deletedUserId = await repo.DeleteAccount(Guid.Parse("11111111-1111-1111-1111-111111111111"));

            deletedUserId.ShouldBe(Guid.Parse("11111111-1111-1111-1111-111111111111"));
            var user = await context.Customers.FindAsync(deletedUserId);
            user.ShouldBeNull();
        }

        [Fact]
        public async Task GetUserIdByEmail_ShouldReturnCorrectUserId()
        {
            var context = await GetDbContext();
            var repo = new UserRepositoryAsync(context);

            var userId = repo.GetUserIdByEmail("testuser@example.com");

            userId.ShouldBe(Guid.Parse("11111111-1111-1111-1111-111111111111"));
        }
    }
}
