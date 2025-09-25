using FluentValidation;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Question.Commands.CreateQuestion
{
    public class CreateQuestionCommandValidator : AbstractValidator<CreateQuestionCommandRequest>
    {
        public CreateQuestionCommandValidator()
        {

            RuleFor(x => x.QuizId)
                .NotEmpty().WithMessage("Quiz ID is required.");

            RuleFor(x => x.Text)
                .NotEmpty().WithMessage("Question text is required.")
                .MaximumLength(500).WithMessage("Question text cannot exceed 500 characters.");

            RuleFor(x => x.Type)
                .NotEmpty().WithMessage("Question type is required.")
                .Must(type => new[] { "SingleChoice", "MultipleChoice", "TrueFalse", "FillInTheBlank" }.Contains(type))
                .WithMessage("Invalid question type. Valid types are: SingleChoice, MultipleChoice, TrueFalse, FillInTheBlank.");

            When(x => x.Type == "SingleChoice" || x.Type == "MultipleChoice", () =>
            {
                RuleFor(x => x.Options)
                    .NotNull().WithMessage("Options must not be null.")
                    .Must(options => options.Count >= 2 && options.Count <= 4)
                    .WithMessage("Options must contain between 2 and 4 items.");

                RuleFor(x => x.Options)
                    .Must(options => options.All(opt => !string.IsNullOrWhiteSpace(opt)))
                    .WithMessage("All options must be non-empty strings.");
            });

            When(x => x.Type == "SingleChoice", () =>
            {
                RuleFor(x => x.CorrectOptionIndex)
                    .GreaterThan(0).WithMessage("Correct option index must be non-negative.");

                RuleFor(x => x.CorrectOptionIndex)
                    .LessThanOrEqualTo(x => x.Options.Count)
                    .WithMessage("Correct option index must be within the range of available options.");
            });

            When(x => x.Type == "MultipleChoice", () =>
            {
                RuleFor(x => x.CorrectOptionIndices)
                    .NotNull().WithMessage("Correct option indices must be provided.")
                    .Must(indices => indices.Count >= 1)
                    .WithMessage("At least one correct option index must be provided.");
            });

            When(x => x.Type == "TrueFalse", () =>
            {
                RuleFor(x => x.CorrectAnswerBool)
                    .NotNull().WithMessage("Correct answer (boolean) is required for TrueFalse questions.");
            });

            When(x => x.Type == "FillInTheBlank", () =>
            {
                RuleFor(x => x.CorrectAnswerText)
                    .NotEmpty().WithMessage("Correct answer (text) is required for FillInTheBlank questions.");
            });

        }
    }
}
