/*using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;

public class GetProductsByCategoryFilterQueryHandler : IRequestHandler<GetProductsByCategoryFilterQuery, List<FilteredProductDto>>
{
    private readonly Applica _context;

    public GetProductsByCategoryFilterQueryHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<FilteredProductDto>> Handle(GetProductsByCategoryFilterQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .Include(p => p.ProductImageList)
            .AsQueryable();

        if (request.CategoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == request.CategoryId.Value);
        }
        else if (!string.IsNullOrWhiteSpace(request.CategoryName))
        {
            query = query.Where(p => p.Category.Name.ToLower().Contains(request.CategoryName.ToLower()));
        }

        return await query.Select(p => new FilteredProductDto
        {
            Name = p.Name,
            Description = p.Description,
            PricePerWeek = p.PricePerWeek,
            PricePerMonth = p.PricePerMonth,
            IsRent = p.IsRent,
            CategoryName = p.Category.Name,
            ProductImageUrls = p.ProductImageList.Select(img => img.ImageUrl).ToList()
        }).ToListAsync(cancellationToken);
    }

}
*/