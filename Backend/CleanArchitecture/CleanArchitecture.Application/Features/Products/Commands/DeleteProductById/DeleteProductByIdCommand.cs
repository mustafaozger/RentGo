using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Core.Exceptions;
using CleanArchitecture.Core.Interfaces.Repositories;
using CleanArchitecture.Core.Wrappers;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Features.Products.Commands.DeleteProductById
{
    public class DeleteProductByIdCommand : IRequest<Boolean>
    {
        public Guid Id { get; set; }
        public class DeleteProductByIdCommandHandler : IRequestHandler<DeleteProductByIdCommand, Boolean>
        {
            private readonly IProductRepositotyAsync _productRepository;
            public DeleteProductByIdCommandHandler(IProductRepositotyAsync productRepository)
            {
                _productRepository = productRepository;
            }
            public async Task<Boolean> Handle(DeleteProductByIdCommand command, CancellationToken cancellationToken)
            {
                var product = await _productRepository.GetProductById(command.Id);
                if (product == null) throw new ApiException($"Product Not Found.");

                var response=  await _productRepository.DeleteProductById(product.Id);
                return response;
            }
        }
    }
}
