using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Application.Features.Order.Command;
using CleanArchitecture.Application.Features.Order.Queries;
using CleanArchitecture.Application.Features.Orders.Command;
using CleanArchitecture.Application.Features.Orders.Queries;
using CleanArchitecture.Core.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.WebApi.Controllers.v1
{
 [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class OrderController : BaseApiController
    {
        private readonly IMediator _mediator;

        public OrderController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // POST: api/v1/Order/confirm
        [HttpPost("confirm")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Confirm([FromBody] ConfirmOrderCommand command)
        {
            var orderId = await _mediator.Send(command);
            return Ok(orderId);
        }

        // GET: api/v1/Order
        
        [HttpGet("get-all-orders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _mediator.Send(new GetAllOrdersQuery());
            return Ok(orders);
        }
        [HttpGet("get-order:{orderId}")]
        public async Task<IActionResult> GetById(Guid orderId)
        {
            var cart = await Mediator.Send(new GetOrderByIdQuery { OrderId = orderId });
            if (cart == null)
                return NotFound();
            return Ok(cart);
        }


        [HttpGet("get-orders-by-customer-id:{customerId}")]
        public async Task<IActionResult> GetOrdersByCustomerId([FromRoute] Guid customerId)
        {
            var orders = await _mediator.Send(new GetOrderByCustomerIdQuery { CustomerId = customerId });
            return Ok(orders);
        }   

        [HttpGet("get-order-status:{status}")]
        public async Task<IActionResult> GetOrdersByStatus([FromRoute] string status)
        {
            var orders = await _mediator.Send(new GetOrdersByStatusQuery { Status = status });
            if (orders == null)
                return NotFound();
            return Ok(orders);
        }

        [HttpPost("change-order-status-of-order-id:{orderId:guid}")]
        public async Task<IActionResult> UpdateOrderStatus([FromRoute] Guid orderId, [FromBody] string status)
        {
            var result = await _mediator.Send(new UpdateOrderStatusCommand { OrderId = orderId, Status = status });
            return Ok(result);
        }
    }


}