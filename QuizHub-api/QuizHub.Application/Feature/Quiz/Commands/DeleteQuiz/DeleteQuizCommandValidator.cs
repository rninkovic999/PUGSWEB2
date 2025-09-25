using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Quiz.Commands.DeleteQuiz
{
    public class DeleteQuizCommandValidator : AbstractValidator<DeleteQuizCommandRequest>
    {
        public DeleteQuizCommandValidator() 
        { 
            
            RuleFor(x => x.QuizId)
                .NotEmpty().WithMessage("Quiz ID cannot be empty.")
                .NotNull().WithMessage("Quiz ID cannot be null.");
            
        }
    }
}
