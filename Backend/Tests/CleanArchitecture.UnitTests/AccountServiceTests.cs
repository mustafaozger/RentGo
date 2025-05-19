using CleanArchitecture.Application.Entities;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Core.DTOs.Account;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Settings;
using CleanArchitecture.Infrastructure.Contexts;
using CleanArchitecture.Infrastructure.Models;
using CleanArchitecture.Infrastructure.Repositories;
using CleanArchitecture.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Moq;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace CleanArchitecture.UnitTests
{
    public class AccountServiceTests
    {
        private async Task<(ApplicationDbContext, UserManager<ApplicationUser>, SignInManager<ApplicationUser>, RoleManager<IdentityRole>, IAccountService, Mock<IUserRepositoryAsync>)> GetMocksAsync()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            var context = new ApplicationDbContext(options);

            var store = new Mock<IUserStore<ApplicationUser>>();
            store.As<IUserEmailStore<ApplicationUser>>();
            store.As<IUserPasswordStore<ApplicationUser>>();

            var userManager = new UserManager<ApplicationUser>(store.Object, null, null, null, null, null, null, null, null);
            var signInManager = new SignInManager<ApplicationUser>(userManager, new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>().Object, new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>().Object, null, null, null, null);
            var roleManager = new RoleManager<IdentityRole>(new Mock<IRoleStore<IdentityRole>>().Object, null, null, null, null);

            var jwtSettings = Options.Create(new JWTSettings
            {
                Key = "supersecurekey1234567890",
                Issuer = "localhost",
                Audience = "localhost",
                DurationInMinutes = 60
            });

            var mockUserRepo = new Mock<IUserRepositoryAsync>();
            var mockEmailService = new Mock<IEmailService>();
            var mockDateTimeService = new Mock<IDateTimeService>();
            mockDateTimeService.Setup(x => x.NowUtc).Returns(DateTime.UtcNow);

            var service = new AccountService(userManager, roleManager, jwtSettings, mockDateTimeService.Object, signInManager, mockUserRepo.Object, mockEmailService.Object);
            return (context, userManager, signInManager, roleManager, service, mockUserRepo);
        }

        [Fact]
        public async Task RegisterAsync_ShouldThrowException_IfEmailAlreadyExists()
        {
            var (context, userManager, signInManager, roleManager, service, _) = await GetMocksAsync();

            var request = new RegisterRequest
            {
                Email = "test@example.com",
                UserName = "testuser",
                Password = "Password123!",
                FirstName = "Test",
                LastName = "User"
            };

            var userStore = new Mock<IUserStore<ApplicationUser>>();
            userStore.As<IUserEmailStore<ApplicationUser>>();
            userStore.As<IUserPasswordStore<ApplicationUser>>();

            var user = new ApplicationUser { Email = request.Email, UserName = request.UserName };

            var managerMock = new Mock<UserManager<ApplicationUser>>(userStore.Object, null, null, null, null, null, null, null, null);
            managerMock.Setup(m => m.FindByEmailAsync(request.Email)).ReturnsAsync(user);

            var newService = new AccountService(managerMock.Object, roleManager, Options.Create(new JWTSettings { Key = "keykeykeykeykeykey", Issuer = "test", Audience = "test", DurationInMinutes = 60 }), new Mock<IDateTimeService>().Object, signInManager, new Mock<IUserRepositoryAsync>().Object, new Mock<IEmailService>().Object);

            await Should.ThrowAsync<CleanArchitecture.Core.Exceptions.ApiException>(() => newService.RegisterAsync(request, "http://localhost"));
        }

        [Fact]
        public async Task AuthenticateAsync_ShouldThrowException_IfUserNotFound()
        {
            var (context, userManager, signInManager, roleManager, service, _) = await GetMocksAsync();

            var request = new AuthenticationRequest
            {
                Email = "nonexistent@example.com",
                Password = "Password123!"
            };

            await Should.ThrowAsync<CleanArchitecture.Core.Exceptions.ApiException>(() => service.AuthenticateAsync(request, "127.0.0.1"));
        }

        [Fact]
        public async Task RegisterAsync_ShouldAddCustomerWithCart_WhenNewUserRegistered()
        {
            var (context, userManager, signInManager, roleManager, service, mockUserRepo) = await GetMocksAsync();

            var testRequest = new RegisterRequest
            {
                FirstName = "Test",
                LastName = "User",
                Password = "Password123!",
                ConfirmPassword = "Password123!",
                UserName = "testuser",
                Email = "testuser@example.com"
            };

            Customer addedCustomer = null;
            mockUserRepo.Setup(r => r.AddAsync(It.IsAny<Customer>()))
                        .Callback<Customer>(c => addedCustomer = c)
                        .ReturnsAsync((Customer c) => c);

            var userStore = new Mock<IUserStore<ApplicationUser>>();
            userStore.As<IUserEmailStore<ApplicationUser>>();
            userStore.As<IUserPasswordStore<ApplicationUser>>();

            var newUserManager = new Mock<UserManager<ApplicationUser>>(userStore.Object, null, null, null, null, null, null, null, null);
            newUserManager.Setup(m => m.FindByEmailAsync(testRequest.Email)).ReturnsAsync((ApplicationUser)null);
            newUserManager.Setup(m => m.FindByNameAsync(testRequest.UserName)).ReturnsAsync((ApplicationUser)null);
            newUserManager.Setup(m => m.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success);
            newUserManager.Setup(m => m.AddToRoleAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success);
            newUserManager.Setup(m => m.GenerateEmailConfirmationTokenAsync(It.IsAny<ApplicationUser>())).ReturnsAsync("dummy-token");

            var serviceWithUser = new AccountService(newUserManager.Object, roleManager, Options.Create(new JWTSettings
            {
                Key = "supersecurekey1234567890",
                Issuer = "localhost",
                Audience = "localhost",
                DurationInMinutes = 60
            }), new Mock<IDateTimeService>().Object, signInManager, mockUserRepo.Object, new Mock<IEmailService>().Object);

            await serviceWithUser.RegisterAsync(testRequest, "http://localhost");

            addedCustomer.ShouldNotBeNull();
            addedCustomer.UserName.ShouldBe("testuser");
            addedCustomer.Email.ShouldBe("testuser@example.com");
            addedCustomer.Cart.ShouldNotBeNull();
        }
    }
}