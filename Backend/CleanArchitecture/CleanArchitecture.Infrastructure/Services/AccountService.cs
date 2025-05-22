using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Core.DTOs.Account;
using CleanArchitecture.Core.DTOs.Email;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Exceptions;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Settings;
using CleanArchitecture.Core.Wrappers;
using CleanArchitecture.Infrastructure.Helpers;
using CleanArchitecture.Infrastructure.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Services
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailService _emailService;
        private readonly JWTSettings _jwtSettings;
        private readonly IDateTimeService _dateTimeService;
        private readonly IUserRepositoryAsync _userRepositoryAsync;
        public AccountService(UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IOptions<JWTSettings> jwtSettings,
            IDateTimeService dateTimeService,
            SignInManager<ApplicationUser> signInManager,
            IUserRepositoryAsync userRepositoryAsync,
            IEmailService emailService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _jwtSettings = jwtSettings.Value;
            _dateTimeService = dateTimeService;
            _signInManager = signInManager;
            _userRepositoryAsync= userRepositoryAsync;
            this._emailService = emailService;
        }

        public async Task<AuthenticationResponse> AuthenticateAsync(AuthenticationRequest request, string ipAddress)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                throw new ApiException($"No Accounts Registered with {request.Email}.");
            }
            var result = await _signInManager.PasswordSignInAsync(user.UserName, request.Password, false, lockoutOnFailure: false);
            if (!result.Succeeded)
            {
                throw new ApiException($"Invalid Credentials for '{request.Email}'.");
            }
            if (!user.EmailConfirmed)
            {
                throw new ApiException($"Account Not Confirmed for '{request.Email}'.");
            }
            JwtSecurityToken jwtSecurityToken = await GenerateJWToken(user);
            AuthenticationResponse response = new AuthenticationResponse();
            var cartID=  _userRepositoryAsync.GetByIdAsync(Guid.Parse(user.Id)).Result.CartId;
            response.CartId = cartID;
            response.Id = user.Id;
            response.JWToken = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
            response.Email = user.Email;
            response.UserName = user.UserName;
            var rolesList = await _userManager.GetRolesAsync(user).ConfigureAwait(false);
            response.Roles = rolesList.ToList();
            response.IsVerified = user.EmailConfirmed;
            var refreshToken = GenerateRefreshToken(ipAddress);
            response.RefreshToken = refreshToken.Token;
            return response;
        }

        public async Task Createuser(ApplicationUser user)
        {
            var cartId = Guid.NewGuid();
            var cart = new Cart
            {
                CartId = cartId,
                CustomerId = Guid.Parse(user.Id),
                CartItemList = new List<CartItem>(),
            };

            var result = new Customer
            {
                Id = Guid.Parse(user.Id),
                Name = user.FirstName + " " + user.LastName,
                UserName = user.UserName,
                Email = user.Email,
                Role = Roles.Basic.ToString(),
                Cart = cart,
                CartId = cart.CartId,
                AccountCreatedDate = _dateTimeService.NowUtc
            };       
            if (result!=null && cart!=null )
            {
                await _userRepositoryAsync.AddAsync(result);
            }
            else
            {
                throw new ApiException();
            }
        }
        public async Task<string> RegisterAsync(RegisterRequest request, string origin)
        {
            var userWithSameUserName = await _userManager.FindByNameAsync(request.UserName);
            if (userWithSameUserName != null)
            {
                throw new ApiException($"Username '{request.UserName}' is already taken.");
            }
            var user = new ApplicationUser
            {
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                UserName = request.UserName
            };
            var userWithSameEmail = await _userManager.FindByEmailAsync(request.Email);
            if (userWithSameEmail == null)
            {
                var result = await _userManager.CreateAsync(user, request.Password);
                if (result.Succeeded)
                {
                    await Createuser(user);
                    await _userManager.AddToRoleAsync(user, Roles.Basic.ToString());
                    var verificationUri = await SendVerificationEmail(user, origin);
                    //TODO: Attach Email Service here and configure it via appsettings
                    //await _emailService.SendAsync(new Core.DTOs.Email.EmailRequest() { From = "mail@codewithmukesh.com", To = user.Email, Body = $"Please confirm your account by visiting this URL {verificationUri}", Subject = "Confirm Registration" });
                    return  $"User Registered. Please confirm your account by visiting this URL {verificationUri}";
                }
                else
                {
                    throw new ApiException($"{result.Errors}");
                }
            }
            else
            {
                throw new ApiException($"Email {request.Email } is already registered.");
            }
        }

        private async Task<JwtSecurityToken> GenerateJWToken(ApplicationUser user)
        {
            var userClaims = await _userManager.GetClaimsAsync(user);
            var roles = await _userManager.GetRolesAsync(user);

            var roleClaims = new List<Claim>();

            for (int i = 0; i < roles.Count; i++)
            {
                roleClaims.Add(new Claim("roles", roles[i]));
            }

            string ipAddress = IpHelper.GetIpAddress();

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("uid", user.Id),
                new Claim("ip", ipAddress)
            }
            .Union(userClaims)
            .Union(roleClaims);

            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

            var jwtSecurityToken = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.DurationInMinutes),
                signingCredentials: signingCredentials);
            return jwtSecurityToken;
        }

        private string RandomTokenString()
        {
            using var rngCryptoServiceProvider = new RNGCryptoServiceProvider();
            var randomBytes = new byte[40];
            rngCryptoServiceProvider.GetBytes(randomBytes);
            // convert random bytes to hex string
            return BitConverter.ToString(randomBytes).Replace("-", "");
        }

        private async Task<string> SendVerificationEmail(ApplicationUser user, string origin)
        {
            var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
            var route = "api/account/confirm-email/";
            var _enpointUri = new Uri(string.Concat($"{origin}/", route));
            var verificationUri = QueryHelpers.AddQueryString(_enpointUri.ToString(), "userId", user.Id);
            verificationUri = QueryHelpers.AddQueryString(verificationUri, "code", code);
            //Email Service Call Here
            return verificationUri;
        }

        public async Task<string> ConfirmEmailAsync(string userId, string code)
        {
            var user = await _userManager.FindByIdAsync(userId);
            code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));
            var result = await _userManager.ConfirmEmailAsync(user, code);
            if (result.Succeeded)
            {
                return  $"Account Confirmed for {user.Email}. You can now use the /api/Account/authenticate endpoint.";
            }
            else
            {
                throw new ApiException($"An error occured while confirming {user.Email}.");
            }
        }

        private RefreshToken GenerateRefreshToken(string ipAddress)
        {
            return new RefreshToken
            {
                Token = RandomTokenString(),
                Expires = DateTime.UtcNow.AddDays(7),
                Created = DateTime.UtcNow,
                CreatedByIp = ipAddress
            };
        }

        public async Task<EmailRequest> ForgotPassword(ForgotPasswordRequest model, string origin)
        {
            var account = await _userManager.FindByEmailAsync(model.Email);

            // always return ok response to prevent email enumeration
            if (account == null) throw new ApiException("User not found");

            var code = await _userManager.GeneratePasswordResetTokenAsync(account);
            var route = "api/account/reset-password/";
            var _enpointUri = new Uri(string.Concat($"{origin}/", route));
            var emailRequest = new EmailRequest()
            {
                Body = $"You reset token is - {code}",
                To = model.Email,
                Subject = "Reset Password",
            };
            //TODO: Attach Email Service here and configure it via appsettings
            //await _emailService.SendAsync(emailRequest);
            return emailRequest;
        }

        public async Task<string> ResetPassword(ResetPasswordRequest model)
        {
            var account = await _userManager.FindByEmailAsync(model.Email);
            if (account == null) throw new ApiException($"No Accounts Registered with {model.Email}.");
            var result = await _userManager.ResetPasswordAsync(account, model.Token, model.Password);
            if (result.Succeeded)
            {
                return  $"Password Resetted.";
            }
            else
            {
                throw new ApiException($"Error occured while reseting the password.");
            }
        }
        
        public async Task<string> UpdateEmailAsync(string userId, string newEmail)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) throw new ApiException("User not found.");

            var token = await _userManager.GenerateChangeEmailTokenAsync(user, newEmail);
            var result = await _userManager.ChangeEmailAsync(user, newEmail, token);

            if (!result.Succeeded)
                throw new ApiException("Email update failed.");

            // Customer tablosunu da güncelle
            var customer = await _userRepositoryAsync.GetByIdAsync(Guid.Parse(userId));
            if (customer != null)
            {
                customer.Email = newEmail;
                await _userRepositoryAsync.UpdateAsync(customer);
            }

            return $"Email updated successfully to {newEmail}";
        }

            public async Task<string> UpdateNameAsync(string userId, string newFirstName, string newLastName)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) throw new ApiException("User not found.");

            user.FirstName = newFirstName;
            user.LastName = newLastName;
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                throw new ApiException("Name update failed.");

            // Customer tablosunu da güncelle
            var customer = await _userRepositoryAsync.GetByIdAsync(Guid.Parse(userId));
            if (customer != null)
            {
                customer.Name = $"{newFirstName} {newLastName}";
                await _userRepositoryAsync.UpdateAsync(customer);
            }

            return $"Name updated successfully to {newFirstName} {newLastName}";
        }

        public async Task<string> ChangePasswordAsync(string userId, string currentPassword, string newPassword)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) throw new ApiException("User not found.");

            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new ApiException($"Password update failed: {errors}");
            }

            return "Password updated successfully.";
        }

        public async Task<string> UpdateUserNameAsync(string userId, string newUserName)
        {
            var existingUser = await _userManager.FindByNameAsync(newUserName);
            if (existingUser != null)
                throw new ApiException($"Username '{newUserName}' is already taken.");

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) throw new ApiException("User not found.");

            user.UserName = newUserName;
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                throw new ApiException("Username update failed.");

            // Customer tablosunu da güncelle
            var customer = await _userRepositoryAsync.GetByIdAsync(Guid.Parse(userId));
            if (customer != null)
            {
                customer.UserName = newUserName;
                await _userRepositoryAsync.UpdateAsync(customer);
            }

            return $"Username updated successfully to {newUserName}";
        }

    }
}
