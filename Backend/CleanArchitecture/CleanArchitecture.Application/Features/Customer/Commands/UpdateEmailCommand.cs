using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Core.Interfaces;
using MediatR;

namespace CleanArchitecture.Application.Features.Customer.Commands
{
    public class UpdateEmailCommand:IRequest<string>
    {
        public string UserId { get; set; }
        public string NewEmail { get; set; }
    }
    public class UpdateEmailCommandHandler : IRequestHandler<UpdateEmailCommand, string>
    {
        private readonly IAccountService _accountService;

        public UpdateEmailCommandHandler(IAccountService accountService)
        {
            _accountService = accountService;
        }

        public async Task<string> Handle(UpdateEmailCommand request, CancellationToken cancellationToken)
        {
            return await _accountService.UpdateEmailAsync(request.UserId, request.NewEmail);
        }
    }
}