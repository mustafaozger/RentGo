using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Interfaces.Repositories;
using CleanArchitecture.Infrastructure.Contexts;
using CleanArchitecture.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Repositories
{
    public class CategoryRepositoryAsync : GenericRepositoryAsync<Category>, ICategoryRepositoryAsync
    {

        private readonly DbSet<Category> _categories;

        public CategoryRepositoryAsync(ApplicationDbContext dbContext) : base(dbContext)
        {
            _categories = dbContext.Set<Category>();
        }

        public Task<IEnumerable<Category>> GetAllCategories()
        {
            return Task.FromResult(_categories.Include(c=>c.Products).AsEnumerable());
        }

        public Task<Category> GetCategoryById(Guid id)
        {
            var category = _categories.FirstOrDefaultAsync(c => c.Id == id);
            if (category == null)
            {
                throw new KeyNotFoundException($"Category with ID {id} not found.");
            }
            return category;
        }
    }
}
