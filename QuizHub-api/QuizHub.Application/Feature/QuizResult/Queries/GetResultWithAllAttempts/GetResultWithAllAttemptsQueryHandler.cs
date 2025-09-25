using MediatR;
using QuizHub.Domain.Contracts;
using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.QuizResult.Queries.GetResultWithAllAttempts
{
    public class GetResultWithAllAttemptsQueryHandler : IRequestHandler<GetResultWithAllAttemptsQueryRequest, GetResultWithAllAttemptsQueryResponse>
    {
        private readonly IQuizResultRepository _quizResultRepository;

        public GetResultWithAllAttemptsQueryHandler(IQuizResultRepository quizResultRepository)
        {
            _quizResultRepository = quizResultRepository;
        }

        public async Task<GetResultWithAllAttemptsQueryResponse> Handle(GetResultWithAllAttemptsQueryRequest request, CancellationToken cancellationToken)
        {
            var result = await _quizResultRepository
            .GetResultWithQuizAndAnswersAsync(request.ResultId, cancellationToken);

            if (result == null)
            {
                throw new Exception("Result not found");
            }

            var allAttempts = await _quizResultRepository
                .GetAllAttemptsByUserAndQuizAsync(result.UserId, result.QuizId, cancellationToken);

            var questions = result.Quiz.Questions;
            var userAnswers = result.Answers;

            var questionsDto = new List<QuestionDto>();

            foreach (var question in questions)
            {
                var userAnswer = userAnswers.FirstOrDefault(a => a.QuestionId == question.Id);

                questionsDto.Add(new QuestionDto
                {
                    Id = question.Id,
                    Type = question.Type,
                    Text = question.Text,
                    Options = question switch
                    {
                        SingleChoiceQuestion sc => sc.Options,
                        MultipleChoiceQuestion mc => mc.Options,
                        _ => null
                    },
                    UserAnswer = userAnswer?.Answer,
                    CorrectAnswer = question switch
                    {
                        SingleChoiceQuestion sc => sc.CorrectOptionIndex,
                        MultipleChoiceQuestion mc => mc.CorrectOptionIndices,
                        TrueFalseQuestion tf => tf.CorrectAnswer,
                        FillInTheBlankQuestion fb => fb.CorrectAnswer,
                        _ => null
                    },
                    IsCorrect = userAnswer?.IsCorrect ?? false
                });
            }

            var attemptsDto = allAttempts
                .OrderBy(a => a.CompletedAt)
                .Select(a => new AttemptDto
                {
                    Time = a.TimeElapsedSeconds,
                    CorrectAnswers = a.CorrectAnswers
                })
                .ToList();

            return new GetResultWithAllAttemptsQueryResponse
            {
                TimeElapsedSeconds = result.TimeElapsedSeconds,
                Questions = questionsDto,
                Attempts = attemptsDto
            };
        }
    }
}
