using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Core.Features.Products.Queries.GetAllProducts;
using MediatR;

namespace CleanArchitecture.Application.Features.Products.Queries.GetProdutsWithName
{
    public class GetProductsWithNameCommand:IRequest<IEnumerable<GetAllProductsViewModel>>
    {
        public string ProductName { get; set; }
    }

    public class GetProductsWithNameHandler : IRequestHandler<GetProductsWithNameCommand, IEnumerable<GetAllProductsViewModel>>
    {
        private readonly IProductRepositotyAsync _productRepository;

        public GetProductsWithNameHandler(IProductRepositotyAsync productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<GetAllProductsViewModel>> Handle(GetProductsWithNameCommand request, CancellationToken cancellationToken)
        {

            var products = await _productRepository.GetProductByName(request.ProductName);
            return products.Data;
        }
    }
}