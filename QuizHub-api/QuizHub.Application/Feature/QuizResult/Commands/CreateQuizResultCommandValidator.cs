using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.QuizResult.Commands
{
    public class CreateQuizResultCommandValidator : AbstractValidator<CreateQuizResultCommandRequest>
    {
        public CreateQuizResultCommandValidator()
        {
            RuleFor(x => x.TimeElapsedSeconds)
                .NotEmpty().WithMessage("TimeElapsedSeconds is required.");
            RuleFor(x => x.QuizId)
                .NotEmpty().WithMessage("QuizId is required.");
        }
    }
}
