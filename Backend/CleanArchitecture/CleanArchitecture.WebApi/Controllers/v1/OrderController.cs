using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Application.Features.Order.Command;
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
    }
}