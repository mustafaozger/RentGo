using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Features.Categories.Commands.CreateCategory;
using CleanArchitecture.Core.Features.Categories.Queries.GetAllCategories;
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

    public class CategoryController : BaseApiController
    {

        [HttpPost]
        public async Task<IActionResult> Post(CreateCategoryCommand command)
        {
            return Ok(await Mediator.Send(command));
        }


        [HttpGet]
        public async Task<IEnumerable<Category>> Get()
        {
            return await Mediator.Send(new GetAllCategoriesQuery());
        }


        [HttpGet("filter-by-category")]
        public async Task<IActionResult> GetByCategory([FromQuery] Guid? categoryId, [FromQuery] string? categoryName, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var filter = new GetAllProductsByCategoryFilterParameter
            {
                CategoryId = categoryId,
                CategoryName = categoryName,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await Mediator.Send(new GetAllProductsByCategoryFilterQuery(filter));
            return Ok(result);
        }

    }
}
