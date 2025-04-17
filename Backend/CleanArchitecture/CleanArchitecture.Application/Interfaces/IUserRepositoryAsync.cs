using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Wrappers;
namespace CleanArchitecture.Application.Interfaces
{
    public interface IUserRepositoryAsync:  IGenericRepositoryAsync<Customer>
    {
        User GetById(Guid id);
        Task<Guid> DeleteAccount(Guid userId);
        Guid GetUserIdByEmail(string email);
    }
}