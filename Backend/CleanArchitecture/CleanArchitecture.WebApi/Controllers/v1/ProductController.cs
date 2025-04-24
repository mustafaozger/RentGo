using CleanArchitecture.Application.Features.Products.Commands.CreateProduct;
using CleanArchitecture.Core.Features.Products.Commands.DeleteProductById;
using CleanArchitecture.Core.Features.Products.Commands.UpdateProduct;
using CleanArchitecture.Core.Features.Products.Queries.GetAllProducts;
using CleanArchitecture.Core.Features.Products.Queries.GetProductById;
using CleanArchitecture.Core.Wrappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CleanArchitecture.WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    [ApiController]
    public class ProductController : BaseApiController
    {
        // ✅ GET: api/v1/Product
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(PagedResponse<List<GetAllProductsViewModel>>))]
        public async Task<IActionResult> Get([FromQuery] GetAllProductsParameter filter)
        {
            var query = new GetAllProductsQuery
            {
                PageSize = filter.PageSize,
                PageNumber = filter.PageNumber
            };
            var response = await Mediator.Send(query);
            return Ok(response);
        }

        // ✅ GET: api/v1/Product/{id}
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetAllProductsViewModel))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await Mediator.Send(new GetProductByIdQuery { Id = id });
            if (result == null)
                return NotFound();
            return Ok(result);
        }



        // ✅ POST: api/v1/Product
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Guid))]
        public async Task<IActionResult> Post([FromBody] CreateProductCommand command)
        {
            var result = await Mediator.Send(command);
            return Ok(result); // result = new Guid (ürün ID’si)
        }

        // ✅ PUT: api/v1/Product/{id}
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Put(Guid id, [FromBody] UpdateProductCommand command)
        {
            if (id != command.Id)
                return BadRequest("ID mismatch");

            var result = await Mediator.Send(command);
            return Ok(result);
        }

        // ✅ DELETE: api/v1/Product/{id}
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await Mediator.Send(new DeleteProductByIdCommand { Id = id });
            return Ok(result);
        }
    }
}
