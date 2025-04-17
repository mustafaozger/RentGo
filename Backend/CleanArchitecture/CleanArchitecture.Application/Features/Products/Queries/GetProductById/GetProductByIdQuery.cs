using CleanArchitecture.Core.Exceptions;
using CleanArchitecture.Core.Interfaces.Repositories;
using CleanArchitecture.Core.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.Interfaces;
using System;
using CleanArchitecture.Core.Features.Products.Queries.GetAllProducts;
using System.Collections.Generic;
using CleanArchitecture.Core.Wrappers;

namespace CleanArchitecture.Core.Features.Products.Queries.GetProductById
{
    public class GetProductByIdQuery : IRequest<GetAllProductsViewModel>
    {
        public Guid Id { get; set; }

    }
    
    public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, GetAllProductsViewModel>
    {
        private readonly IProductRepositotyAsync _productRepository;
        public GetProductByIdQueryHandler(IProductRepositotyAsync productRepository)
        {
            _productRepository = productRepository;
        }
        public async Task<GetAllProductsViewModel> Handle(GetProductByIdQuery query, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetProductById(query.Id);
            if (product == null)
                throw new ApiException("Product Not Found");
            return product;
        }
    }
}
