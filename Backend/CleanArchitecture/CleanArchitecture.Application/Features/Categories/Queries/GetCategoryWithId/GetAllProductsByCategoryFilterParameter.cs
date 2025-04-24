using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.Features.Categories;
using CleanArchitecture.Application.Features.Products;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Core.Features.Products.Queries.GetAllProducts;
using CleanArchitecture.Core.Filters;
using CleanArchitecture.Core.Wrappers;
using MediatR;

public class GetAllProductsByCategoryFilterParameter : RequestParameter
{
    public Guid? CategoryId { get; set; }
    public string? CategoryName { get; set; }
}
public class GetAllProductsByCategoryFilterQuery : IRequest<PagedResponse<IEnumerable<GetAllProductsViewModel>>>
{
    public GetAllProductsByCategoryFilterParameter Filter { get; set; }

    public GetAllProductsByCategoryFilterQuery(GetAllProductsByCategoryFilterParameter filter)
    {
        Filter = filter;
    }
}

public class GetAllProductsByCategoryFilterQueryHandler : IRequestHandler<GetAllProductsByCategoryFilterQuery, PagedResponse<IEnumerable<GetAllProductsViewModel>>>
{
    private readonly IProductRepositotyAsync _productRepository;

    public GetAllProductsByCategoryFilterQueryHandler(IProductRepositotyAsync productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<PagedResponse<IEnumerable<GetAllProductsViewModel>>> Handle(GetAllProductsByCategoryFilterQuery request, CancellationToken cancellationToken)
    {
        var filter = request.Filter;

        if (filter.CategoryId.HasValue)
        {
            return await _productRepository.GetAllProductsByCategoryId(new GetAllProductsByCategoryIdParameter
            {
                CategoryId = filter.CategoryId.Value,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            });
        }
        else if (!string.IsNullOrWhiteSpace(filter.CategoryName))
        {
            return await _productRepository.GetAllProductsByCategoryName(new GetAllProductsByCategoryNameParameter
            {
                categoryName = filter.CategoryName,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            });
        }

        // Eğer hiçbir filtre yoksa tüm ürünleri döndür
        return await _productRepository.GetAllProducts(new GetAllProductsParameter
        {
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize
        });
    }

}


