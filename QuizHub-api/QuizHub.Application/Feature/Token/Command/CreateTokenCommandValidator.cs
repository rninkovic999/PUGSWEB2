using FluentValidation;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Token.Command
{
    public class CreateTokenCommandValidator : AbstractValidator<CreateTokenRequest>
    {
        private readonly IUserRepository _userRepository;
        public CreateTokenCommandValidator(IUserRepository userRepository) 
        { 
            _userRepository = userRepository;

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters long.");

            RuleFor(x => x.Email)
                .MustAsync(async (email, cancellation) => 
                    await _userRepository.EmailExistsAsync(email, cancellation))
                .WithMessage("Email does not exist.");
        }
    }
}
