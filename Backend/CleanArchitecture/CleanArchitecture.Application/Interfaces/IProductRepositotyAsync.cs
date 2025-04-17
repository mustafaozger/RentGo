using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Application.Features.Categories;
using CleanArchitecture.Application.Features.Products;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Features.Products.Queries.GetAllProducts;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Wrappers;

namespace CleanArchitecture.Application.Interfaces
{
    public interface IProductRepositotyAsync:IGenericRepositoryAsync<Product>
    {
        Task<PagedResponse<IEnumerable<GetAllProductsViewModel>>> GetAllProducts(GetAllProductsParameter parameter);
        Task<PagedResponse<IEnumerable<GetAllProductsViewModel>>> GetAllProductsByCategoryId(GetAllProductsByCategoryIdParameter parameter);
        Task<PagedResponse<IEnumerable<GetAllProductsViewModel>>> GetAllProductsByCategoryName(GetAllProductsByCategoryNameParameter parameter);
        Task<PagedResponse<IEnumerable<GetAllProductsViewModel>>> GetAllProductsByName(GetAllProductsByNameParameter parameter);
       Task<GetAllProductsViewModel> GetProductById(Guid id);
        Task<PagedResponse<IEnumerable<GetAllProductsViewModel>>> GetProductByName(string name);
        
    }
}