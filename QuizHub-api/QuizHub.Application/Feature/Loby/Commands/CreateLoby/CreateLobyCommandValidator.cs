using FluentValidation;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Loby.Commands.CreateLoby
{
    public class CreateLobyCommandValidator : AbstractValidator<CreateLobyCommandRequest>
    {
        private readonly IQuizRepository _quizRepository;
        public CreateLobyCommandValidator(IQuizRepository quizRepository) 
        { 

            _quizRepository = quizRepository ?? throw new ArgumentNullException(nameof(quizRepository));

            RuleFor(x => x.QuizTitle)
                .NotEmpty().WithMessage("QuizTitle is required.")
                .MaximumLength(100).WithMessage("QuizTitle must not exceed 100 characters.");

            RuleFor(x => x.QuizTitle)
                .MustAsync(async (title, cancellation) => 
                {
                    var quiz = await _quizRepository.GetQuizByTitleAsync(title, cancellation);
                    return quiz != null;
                }).WithMessage("Quiz with the specified title does not exist.");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required.")
                .MaximumLength(100).WithMessage("Name must not exceed 100 characters.");

            RuleFor(x => x.TimePreQuestionLimitSeconds)
                .GreaterThan(0).WithMessage("TimePreQuestionLimitSeconds must be greater than zero.");
            
            RuleFor(x => x.StartAt)
                .GreaterThan(DateTime.UtcNow).WithMessage("StartAt must be in the future.");
        }
    }
}
