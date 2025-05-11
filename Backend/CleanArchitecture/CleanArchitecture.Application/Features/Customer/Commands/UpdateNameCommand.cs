using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Core.Interfaces;
using MediatR;

namespace CleanArchitecture.Application.Features.Customer.Commands
{
    public class UpdateNameCommand:IRequest<string>
    {
        public string UserId { get; set; }
        public string NewFirstName { get; set; }
        public string NewLastName { get; set; }
    }
    public class UpdateNameCommandHandler : IRequestHandler<UpdateNameCommand, string>
    {
        private readonly IAccountService _accountService;

        public UpdateNameCommandHandler(IAccountService accountService)
        {
            _accountService = accountService;
        }

        public async Task<string> Handle(UpdateNameCommand request, CancellationToken cancellationToken)
        {
        return await _accountService.UpdateNameAsync(request.UserId, request.NewFirstName, request.NewLastName);
        }
    }
}