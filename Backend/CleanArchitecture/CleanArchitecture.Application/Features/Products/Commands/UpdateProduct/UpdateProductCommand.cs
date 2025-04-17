using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Exceptions;
using CleanArchitecture.Core.Interfaces.Repositories;
using CleanArchitecture.Core.Wrappers;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Features.Products.Commands.UpdateProduct
{
    public class UpdateProductCommand : IRequest<Guid>
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double PricePerWeek { get; set; }
        public double PricePerMonth { get; set; }
        public Guid CategoryId { get; set; }
        public List<String> ProductImageList { get; set; }
        public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, Guid>
        {
            private readonly IProductRepositotyAsync _productRepository;

            public UpdateProductCommandHandler(IProductRepositotyAsync productRepository)
            {
                _productRepository = productRepository;
            }

            public async Task<Guid> Handle(UpdateProductCommand command, CancellationToken cancellationToken)
            {
                var existingProduct = await _productRepository.GetProductById(command.Id);
                if (existingProduct == null)
                    throw new EntityNotFoundException("Product", command.Id);

                var updatedProduct = new Product
                {
                    Id = command.Id,
                    Name = command.Name,
                    Description = command.Description,
                    PricePerWeek = command.PricePerWeek,
                    PricePerMonth = command.PricePerMonth,
                    CategoryId = command.CategoryId,
                    ProductImageList = command.ProductImageList
                };

                await _productRepository.UpdateAsync(updatedProduct);

                return updatedProduct.Id;
            }

        }
    }
}
