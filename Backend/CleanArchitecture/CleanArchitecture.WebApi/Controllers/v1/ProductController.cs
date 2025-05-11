using CleanArchitecture.Application.Features.Products.Commands.CreateProduct;
using CleanArchitecture.Application.Features.Products.Queries.GetProdutsWithName;
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
        [HttpGet]
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
        [HttpGet("get-product-list-by-name")]
        public async Task<IActionResult> GetProductListWithName([FromQuery] GetProductsWithNameCommand filter){
            
            var response = await Mediator.Send(filter);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await Mediator.Send(new GetProductByIdQuery { Id = id });
            if (result == null)
                return NotFound();
            return Ok(result);
        }


        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Guid))]
        public async Task<IActionResult> Post([FromBody] CreateProductCommand command)
        {
            var result = await Mediator.Send(command);
            return Ok(result); // result = new Guid (ürün ID’si)
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, [FromBody] UpdateProductCommand command)
        {
            if (id != command.Id)
                return BadRequest("ID mismatch");

            var result = await Mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await Mediator.Send(new DeleteProductByIdCommand { Id = id });
            return Ok(result);
        }
    }
}
