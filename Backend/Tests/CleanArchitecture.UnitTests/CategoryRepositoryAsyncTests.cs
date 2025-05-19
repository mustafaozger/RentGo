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
    public class CategoryRepositoryAsyncTests
    {
        private async Task<ApplicationDbContext> GetDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            var context = new ApplicationDbContext(options);

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
        public async Task GetByIdAsync_ShouldReturnCorrectCategory()
        {
            var context = await GetDbContext();
            var repo = new CategoryRepositoryAsync(context);

            var category = await repo.GetByIdAsync(Guid.Parse("11111111-1111-1111-1111-111111111111"));

            category.ShouldNotBeNull();
            category.Name.ShouldBe("Electronics");
        }

        [Fact]
        public async Task AddAsync_ShouldInsertCategory()
        {
            var context = await GetDbContext();
            var repo = new CategoryRepositoryAsync(context);

            var newCategory = new Category
            {
                Id = Guid.NewGuid(),
                Name = "Books",
                Description = "Books and novels"
            };

            var result = await repo.AddAsync(newCategory);

            result.ShouldNotBeNull();
            result.Name.ShouldBe("Books");
        }

        [Fact]
        public async Task UpdateAsync_ShouldModifyCategory()
        {
            var context = await GetDbContext();
            var repo = new CategoryRepositoryAsync(context);

            var category = await repo.GetByIdAsync(Guid.Parse("11111111-1111-1111-1111-111111111111"));
            category.Description = "Updated description";

            await repo.UpdateAsync(category);

            var updated = await repo.GetByIdAsync(category.Id);
            updated.Description.ShouldBe("Updated description");
        }

        [Fact]
        public async Task DeleteAsync_ShouldRemoveCategory()
        {
            var context = await GetDbContext();
            var repo = new CategoryRepositoryAsync(context);

            var category = await repo.GetByIdAsync(Guid.Parse("11111111-1111-1111-1111-111111111111"));

            await repo.DeleteAsync(category);

            var deleted = await repo.GetByIdAsync(category.Id);
            deleted.ShouldBeNull();
        }
    }
}
