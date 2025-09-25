using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Question.Commands.DeleteQuestion
{
    public class DeleteQuestionCommandValidator : AbstractValidator<DeleteQuestionCommandRequest>
    {
        public DeleteQuestionCommandValidator()
        {
            RuleFor(x => x.QuestionId)
                .NotEmpty().WithMessage("Question ID cannot be empty.")
                .NotNull().WithMessage("Question ID cannot be null.");
            
        }
    }
}
