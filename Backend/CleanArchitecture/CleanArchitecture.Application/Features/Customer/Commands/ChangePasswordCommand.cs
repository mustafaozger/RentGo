using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Core.Interfaces;
using MediatR;

namespace CleanArchitecture.Application.Features.Customer.Commands
{
    public class ChangePasswordCommand:IRequest<string>
    {
        public string UserId { get; set; }
        public string CurrentPassword  { get; set; }
        public string NewPassword { get; set; }
    }
    public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, string>
    {
        private readonly IAccountService _accountService;

        public ChangePasswordCommandHandler(IAccountService accountService)
        {
            _accountService = accountService;
        }

        public async Task<string> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
        {
            return await _accountService.ChangePasswordAsync(request.UserId, request.CurrentPassword, request.NewPassword);
        }
    }
}