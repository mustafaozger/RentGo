using System;
using System.Collections.Generic;
using MediatR;

public record GetProductsByCategoryFilterQuery(Guid? CategoryId, string? CategoryName) : IRequest<List<FilteredProductDto>>;
