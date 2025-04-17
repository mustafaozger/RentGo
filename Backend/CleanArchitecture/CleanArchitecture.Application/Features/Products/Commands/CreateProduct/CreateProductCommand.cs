using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Core.Entities;
using MediatR;

namespace CleanArchitecture.Application.Features.Products.Commands.CreateProduct
{
    public class CreateProductCommand: IRequest<Guid>
    {  
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double PricePerWeek { get; set; }
        public double PricePerMonth { get; set; }
        public Guid CategoryId { get; set; }
        public List<String> ProductImageList { get; set; }
    }

    public class CreateProductCommandHandler: IRequestHandler<CreateProductCommand, Guid>
    {

        private readonly IProductRepositotyAsync _productRepository;

        public CreateProductCommandHandler(IProductRepositotyAsync  productRepository)
        {
            _productRepository = productRepository;

        }

        public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            var product=new Product
            {
                Name = request.Name,
                Description = request.Description,
                PricePerWeek = request.PricePerWeek,
                PricePerMonth = request.PricePerMonth,
                CategoryId = request.CategoryId,
                ProductImageList = request.ProductImageList
            };
            await _productRepository.AddAsync(product);
            return product.Id;
        }
    }
}