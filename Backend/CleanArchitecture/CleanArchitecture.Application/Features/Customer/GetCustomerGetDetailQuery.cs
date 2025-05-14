using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Core.DTOs.Account;
using MediatR;

namespace CleanArchitecture.Application.Features.Customer
{
    public class GetCustomerGetDetailQuery : IRequest<UserDTO>
    {
        public Guid Id { get; set; }
    }

    public class GetCustomerGetDetailQueryHandler : IRequestHandler<GetCustomerGetDetailQuery, UserDTO>
    {
        private readonly IUserRepositoryAsync _userRepository;

        public GetCustomerGetDetailQueryHandler(IUserRepositoryAsync userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserDTO> Handle(GetCustomerGetDetailQuery request,CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetById(request.Id);
            
            if (user == null)
            {
                throw new KeyNotFoundException($"User with Id {request.Id} not found.");
            }

            return new UserDTO
            {
                Id       = user.Id,
                Name     = user.Name,
                Email    = user.Email,
                UserName = user.UserName
            };
        }
    }
}
