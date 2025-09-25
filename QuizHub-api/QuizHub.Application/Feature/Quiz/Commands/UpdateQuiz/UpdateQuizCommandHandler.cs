using MediatR;
using QuizHub.Application.Common.Exceptions;
using QuizHub.Domain.Contracts;
using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Quiz.Commands.UpdateQuiz
{
    public class UpdateQuizCommandHandler : IRequestHandler<UpdateQuizCommandRequest, UpdateQuizCommandResponse>
    {
        private readonly IQuizRepository _quizRepository;
        public UpdateQuizCommandHandler(IQuizRepository quizRepository)
        {
            _quizRepository = quizRepository ?? throw new ArgumentNullException(nameof(quizRepository));
        }
        public async Task<UpdateQuizCommandResponse> Handle(UpdateQuizCommandRequest request, CancellationToken cancellationToken)
        {

            var existingQuiz = await _quizRepository.GetQuizByIdAsync(request.Id, cancellationToken);
            if (existingQuiz == null)
                throw new NotFoundException("quiz", request.Id);

            if (existingQuiz.CreatedByUserId != request.CreatedByUserId)
                throw new UnauthorizedAccessException("You do not have permission to update this quiz.");

            existingQuiz.Title = request.Title;
            existingQuiz.Description = request.Description;
            existingQuiz.Category = request.Category;
            existingQuiz.TimeLimitSeconds = request.TimeLimitSeconds;
            existingQuiz.Difficulty = request.Difficulty;

            existingQuiz.Questions.Clear();

            foreach (var q in request.Questions)
            {
                Domain.Entities.Question question = q.Type switch
                {
                    "SingleChoice" => new SingleChoiceQuestion
                    {
                        Id = q.Id,
                        Text = q.Text,
                        Options = q.Options ?? new(),
                        CorrectOptionIndex = q.CorrectOptionIndex ?? -1,
                    },
                    "MultipleChoice" => new MultipleChoiceQuestion
                    {
                        Id = q.Id,
                        Text = q.Text,
                        Options = q.Options ?? new(),
                        CorrectOptionIndices = q.CorrectOptionIndices ?? new(),
                    },
                    "TrueFalse" => new TrueFalseQuestion
                    {
                        Id = q.Id,
                        Text = q.Text,
                        CorrectAnswer = q.CorrectAnswerBool ?? false,
                    },
                    "FillInTheBlank" => new FillInTheBlankQuestion
                    {
                        Id = q.Id,
                        Text = q.Text,
                        CorrectAnswer = q.CorrectAnswerText ?? string.Empty,
                    },
                    _ => throw new Exception($"Unsupported question type: {q.Type}")
                };

                question.QuizId = existingQuiz.Id;
                existingQuiz.Questions.Add(question);
            }

            var result = await _quizRepository.UpdateQuizAsync(existingQuiz, cancellationToken);
            if (result)
            {
                return new UpdateQuizCommandResponse
                {
                    Success = true,
                    Message = "Quiz updated successfully."
                };
            }

            throw new Exception("Failed to update quiz.");
        }
    }
}
