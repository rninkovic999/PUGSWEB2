using MediatR;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using QuizHub.Application.Common.Exceptions;
using QuizHub.Application.Common.Helpers;
using QuizHub.Domain.Contracts;
using QuizHub.Domain.Settings;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Token.Command
{
    public class CreateTokenCommandHandler : IRequestHandler<CreateTokenRequest, CreateTokenResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly TokenServiceProviderSettings _settings;
        public CreateTokenCommandHandler(IUserRepository userRepository, IOptions<TokenServiceProviderSettings> settings)
        {
            _userRepository = userRepository;
            _settings = settings.Value;
        }
        public async Task<CreateTokenResponse> Handle(CreateTokenRequest request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
            if(user is not null)
            {
                var (_, hashPassword) = HashingService.HashPassword(request.Password, user.PasswordSalt);
                string token = null;
                if (hashPassword == user.PasswordHash)
                {
                    token = GenerateJwtToken(user);
                    return new CreateTokenResponse()
                    {
                        Token = token,
                        Message = "Token created successfully.",
                        Success = true
                    };
                }
            }


            throw new UnauthorizedException("Invalid email or password.");
        }

        private string? GenerateJwtToken(Domain.Entities.User user)
        {
            var isTokenProviderDataValid = ValidateTokenProviderData();
            if (!isTokenProviderDataValid)
            {
                return null;
            }

            var claims = new List<Claim>
            {
                new Claim("UserId", user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Username)
            };

            claims.Add(new Claim(ClaimTypes.Role, user.isAdmin ? "Admin" : "User"));

            var token = new JwtSecurityToken
            (
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMonths(1),
                notBefore: DateTime.UtcNow,
            signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Secret!)),
                    SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool ValidateTokenProviderData() =>
            !(string.IsNullOrEmpty(_settings.Issuer)
                || string.IsNullOrEmpty(_settings.Audience)
                    || string.IsNullOrEmpty(_settings.Secret));
    }
}
