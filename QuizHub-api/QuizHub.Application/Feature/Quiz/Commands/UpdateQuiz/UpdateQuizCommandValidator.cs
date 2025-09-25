using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Quiz.Commands.UpdateQuiz
{
    public class UpdateQuizCommandValidator : AbstractValidator<UpdateQuizCommandRequest>
    {
        public UpdateQuizCommandValidator() 
        { 
            
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Quiz ID is required.")
                .NotNull().WithMessage("Quiz ID cannot be null.");
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(100).WithMessage("Title cannot exceed 100 characters.");
            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");
            RuleFor(x => x.Category)
                .NotEmpty().WithMessage("Category is required.")
                .MaximumLength(50).WithMessage("Category cannot exceed 50 characters.");
            RuleFor(x => x.TimeLimitSeconds)
                .GreaterThan(0).WithMessage("Time limit must be greater than zero.");
            RuleFor(x => x.Difficulty)
                .InclusiveBetween(1, 3).WithMessage("Difficulty must be between 1 and 3.");
        }
    }
}
