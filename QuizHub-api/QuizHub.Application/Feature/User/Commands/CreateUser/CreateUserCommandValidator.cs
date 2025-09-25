using FluentValidation;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.User.Commands.CreateUser
{
    public class CreateUserCommandValidator : AbstractValidator<CreateUserRequest>
    {
        private readonly IUserRepository _userRepository;
        public CreateUserCommandValidator(IUserRepository userRepository) 
        { 
            
            _userRepository = userRepository;

            RuleFor(x => x.Username)
                .NotEmpty().WithMessage("Username is required.")
                .Length(3, 20).WithMessage("Username must be between 3 and 20 characters.");
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.");
            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters long.");
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full name is required.")
                .Length(3, 50).WithMessage("Full name must be between 3 and 50 characters.");

            RuleFor(x => x.Email)
                .MustAsync(async (email, cancellation) => 
                    !await _userRepository.EmailExistsAsync(email, cancellation))
                .WithMessage("Email already exists.");

            RuleFor(x => x.Username)
                .MustAsync(async (username, cancellation) => 
                    !await _userRepository.UsernameExistsAsync(username, cancellation))
                .WithMessage("Username already exists.");

            RuleFor(x => x.ProfilePicture)
                .Cascade(CascadeMode.Stop)
                .NotNull()
                    .WithMessage("Profile picture is required.")
                .Must(file => file.Length > 0)
                    .WithMessage("Profile picture cannot be empty.")
                .Must(file =>
                {
                    var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif" };
                    return allowedTypes.Contains(file.ContentType);
                })
                    .WithMessage("Profile picture must be a valid image file (JPEG, PNG, GIF).")
                .Must(file => file.Length <= 5 * 1024 * 1024) // 5 MB
                    .WithMessage("Profile picture must not exceed 5 MB in size.");


        }
    }
}
