using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Core.Interfaces;
using MediatR;

namespace CleanArchitecture.Application.Features.Customer.Commands
{
    public class UpdateUsernameCommand:IRequest<string>
    {
        public string UserId { get; set; }
        public string NewUsername { get; set; }
    }
    public class UpdateUsernameCommandHandler : IRequestHandler<UpdateUsernameCommand, string>
    {
        private readonly IAccountService _accountService;

        public UpdateUsernameCommandHandler(IAccountService accountService)
        {
            _accountService = accountService;
        }

        public async Task<string> Handle(UpdateUsernameCommand request, CancellationToken cancellationToken)
        {
        return await _accountService.UpdateUserNameAsync(request.UserId, request.NewUsername);
        }
    }
}