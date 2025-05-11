using CleanArchitecture.Application.Features.Carts.Commands.CreateCart;
using CleanArchitecture.Application.Features.Carts.Commands.AddItemToCart;
using CleanArchitecture.Application.Features.Carts.Commands.RemoveItemFromCart;
using CleanArchitecture.Application.Features.Carts.Queries.GetAllCarts;
using CleanArchitecture.Application.Features.Carts.Queries.GetCartById;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Wrappers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CleanArchitecture.Application.Features.Cart.Command;
using CleanArchitecture.Application.Features.Cart.Queries;

namespace CleanArchitecture.WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class CartController : BaseApiController
    {
        // POST: api/v1/Cart
        [HttpPost]
        public async Task<IActionResult> Post(CreateCartCommand command)
        {
            var result = await Mediator.Send(command);
            return Ok(result); // Guid: Created CartId
        }

        // GET: api/v1/Cart
        [HttpGet]
        public async Task<IEnumerable<Cart>> Get()
        {
            return await Mediator.Send(new GetAllCartsQuery());
        }

        // GET: api/v1/Cart/{id}
        [HttpGet("{cartId}")]
        public async Task<IActionResult> GetById(Guid cartId)
        {
            var cart = await Mediator.Send(new GetCartByIdQuery { CartId = cartId });
            if (cart == null)
                return NotFound();
            return Ok(cart);
        }

        // POST: api/v1/Cart/add-item
        [HttpPost("add-item-with-cart-id")]
        public async Task<IActionResult> AddItem(AddItemToCartCommand command)
        {
            var result = await Mediator.Send(command);
            return Ok(result); // Guid: Added ProductId
        }

        // DELETE: api/v1/Cart/remove-item
        [HttpDelete("remove-item")]
        public async Task<IActionResult> RemoveItem([FromBody] RemoveCartItemCommand command)
        {
            var result = await Mediator.Send(command);
            return Ok("Product removed.");
        }
        [HttpPut("update-item")]
        public async Task<IActionResult> UpdateItem([FromBody] ChangeCartItemCountCommand command)
        {
            var result = await Mediator.Send(command);
            if (result == null)
                return NotFound($"CartItem with Id '{command.CartItemId}' not found.");
            return Ok(result);  
        }

        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetCartByCustomerId(Guid customerId)
        {
            var cart = await Mediator.Send(new GetCartByCustomerId { CustomerId = customerId });
            if (cart == null)
                return NotFound();
            return Ok(cart);
        }
        [HttpPost("add-item-with-user-id")]
        public async Task<IActionResult> AddItemWithUserId(AddItemToCartWithCustomerIdCommand command)
        {
            var result = await Mediator.Send(command);
            return Ok(result); 
        }

    }
}
