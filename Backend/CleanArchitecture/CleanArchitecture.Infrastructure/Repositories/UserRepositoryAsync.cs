using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Infrastructure.Contexts;
using CleanArchitecture.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Infrastructure.Repositories
{
    public class UserRepositoryAsync : GenericRepositoryAsync<Customer>, IUserRepositoryAsync
    {
        private readonly DbSet<Customer> _users;
        private readonly ApplicationDbContext _dbContext;

        public UserRepositoryAsync(ApplicationDbContext dbContext) : base(dbContext)
        {
            _users = dbContext.Set<Customer>();
            _dbContext = dbContext;
        }


        public async Task<Guid> DeleteAccount(Guid userId)
        {
            var user = await _users.FirstOrDefaultAsync(x => x.Id == userId);
            if (user == null)
                throw new InvalidOperationException("User not found");

            _users.Remove(user);
            await _dbContext.SaveChangesAsync();
            return userId;
        }

        public Task<Customer> GetById(Guid id)
        {
           /// return _users.FirstOrDefault(x => x.Id == id);
            return _users.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id);
        }

        public Guid GetUserIdByEmail(string email)
        {
            var user = _users.FirstOrDefault(x => x.Email == email);
            if (user == null)
                throw new InvalidOperationException("User not found by email");
            return user.Id;
        }


        Task<Customer> IUserRepositoryAsync.GetById(Guid id)
        {
            return GetById(id);
        }
    }
}
