using AutoMapper;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Core.Interfaces.Repositories;
using CleanArchitecture.Core.Wrappers;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Features.Products.Queries.GetAllProducts
{
    public class GetAllProductsQuery : IRequest<PagedResponse<IEnumerable<GetAllProductsViewModel>>>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }

    public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, PagedResponse<IEnumerable<GetAllProductsViewModel>>>
    {
        private readonly IProductRepositotyAsync _productRepository;
        private readonly IMapper _mapper;

        public GetAllProductsQueryHandler(
            IProductRepositotyAsync productRepository, 
            IMapper mapper)
        {
            _productRepository = productRepository;
            _mapper = mapper;
        }

        public async Task<PagedResponse<IEnumerable<GetAllProductsViewModel>>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
        {
            var validFilter = new GetAllProductsParameter
            {
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };

            return await _productRepository.GetAllProducts(validFilter);
        }
    }

}
