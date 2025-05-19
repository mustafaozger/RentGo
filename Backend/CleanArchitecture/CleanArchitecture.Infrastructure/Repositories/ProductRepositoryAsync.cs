using CleanArchitecture.Application.Features.Categories;
using CleanArchitecture.Application.Features.Products;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Features.Products.Queries.GetAllProducts;
using CleanArchitecture.Core.Interfaces.Repositories;
using CleanArchitecture.Core.Wrappers;
using CleanArchitecture.Infrastructure.Contexts;
using CleanArchitecture.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Repositories
{
    public class ProductRepositoryAsync : GenericRepositoryAsync<Product>, IProductRepositotyAsync
    {
        private readonly DbSet<Product> _products;
        private readonly ApplicationDbContext _context;


        public ProductRepositoryAsync(ApplicationDbContext dbContext) : base(dbContext)
        {
            _context=dbContext;
            _products = dbContext.Set<Product>();
        }

        public Task<bool> IsUniqueBarcodeAsync(string barcode)
        {
         /*   
            return _products
                .AllAsync(p => p.Barcode != barcode);
                */
                return null;
        }
        private static GetAllProductsViewModel MapToViewModel(Product p)
        {
            return new GetAllProductsViewModel
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                PricePerWeek = p.PricePerWeek,
                PricePerMonth = p.PricePerMonth,
                CategoryId = p.CategoryId,
                ProductImageList = p.ProductImageList
            };
        }

        public async Task<PagedResponse<IEnumerable<GetAllProductsViewModel>>> GetAllProducts(GetAllProductsParameter parameter)
        {
            IQueryable<Product> product = _products.AsQueryable();
            var totalCount = await product.CountAsync();
            var products = await product
                .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                .Take(parameter.PageSize)
                .ToListAsync();
            var result= await product.Select(p=> new GetAllProductsViewModel
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                PricePerWeek = p.PricePerWeek,
                PricePerMonth = p.PricePerMonth,
                CategoryId = p.CategoryId,
                ProductImageList = p.ProductImageList
            }).ToListAsync();
            return new PagedResponse<IEnumerable<GetAllProductsViewModel>>(result,parameter.PageNumber,parameter.PageSize);
        }
        public async Task<PagedResponse<IEnumerable<GetAllProductsViewModel>>> GetAllProductsByCategoryName(GetAllProductsByCategoryNameParameter parameter)
        {
            var query = _products
                .Include(p => p.Category)
                .Where(p => p.Category.Name.Contains(parameter.categoryName));
            var totalCount = await query.CountAsync();
            var result = await query
                .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                .Take(parameter.PageSize)
                .Select(p => MapToViewModel(p))
                .ToListAsync();
            return new PagedResponse<IEnumerable<GetAllProductsViewModel>>(result, parameter.PageNumber, parameter.PageSize);
        }
        public async Task<PagedResponse<IEnumerable<GetAllProductsViewModel>>> GetAllProductsByName(GetAllProductsByNameParameter parameter)
        {
            var query = _products
                .Where(p => p.Name.Contains(parameter.productName));

            var totalCount = await query.CountAsync();

            var result = await query
                .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                .Take(parameter.PageSize)
                .Select(p => MapToViewModel(p))
                .ToListAsync();

            return new PagedResponse<IEnumerable<GetAllProductsViewModel>>(result, parameter.PageNumber, parameter.PageSize);
        }

            public async Task<GetAllProductsViewModel> GetProductById(Guid id)
            {
                var product = await _products
                    .Where(p => p.Id == id)
                    .Select(p => MapToViewModel(p))
                    .FirstOrDefaultAsync(); // sadece tek ürün al

                return product;
            }

        public async Task<PagedResponse<IEnumerable<GetAllProductsViewModel>>> GetProductByName(string name)
        {
            var result = await _products
                .Where(p => p.Name.Contains(name))
                .Select(p => MapToViewModel(p))
                .ToListAsync();

            return new PagedResponse<IEnumerable<GetAllProductsViewModel>>(result, 1, 1);
        }

        public async Task<PagedResponse<IEnumerable<GetAllProductsViewModel>>> GetAllProductsByCategoryId(GetAllProductsByCategoryIdParameter parameter)
        {
            var query = _products.Where(p => p.CategoryId == parameter.CategoryId);

            var totalCount = await query.CountAsync();

            var pagedProducts = await query
                .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                .Take(parameter.PageSize)
                .Select(p => new GetAllProductsViewModel
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    PricePerWeek = p.PricePerWeek,
                    PricePerMonth = p.PricePerMonth,
                    CategoryId = p.CategoryId,
                    ProductImageList = p.ProductImageList
                })
                .ToListAsync();

            return new PagedResponse<IEnumerable<GetAllProductsViewModel>>(pagedProducts, parameter.PageNumber, parameter.PageSize);
        }

        public Task<bool> DeleteProductById(Guid id)
        {
            var trackedEntity = _context.ChangeTracker.Entries<Product>()
                .FirstOrDefault(e => e.Entity.Id == id);

            if (trackedEntity != null)
                trackedEntity.State = EntityState.Detached; // Takibi bırak

            var product = new Product { Id = id };

            _context.Products.Attach(product);
            _context.Products.Remove(product);
            _context.SaveChanges();

            return Task.FromResult(true);
        }

    }
}
