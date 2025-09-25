using MediatR;
using QuizHub.Domain.Contracts;
using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.QuizResult.Queries.GetQuizResultById
{
    public class GetQuizResultByIdQueryHandler : IRequestHandler<GetQuizResultByIdQueryRequest, GetQuizResultByIdQueryResponse>
    {
        private readonly IQuizResultRepository _quizResultRepository;
        private readonly IUserRepository _userRepository;

        public GetQuizResultByIdQueryHandler(
            IQuizResultRepository quizResultRepository,
            IUserRepository userRepository)
        {
            _quizResultRepository = quizResultRepository;
            _userRepository = userRepository;
        }

        public async Task<GetQuizResultByIdQueryResponse> Handle(GetQuizResultByIdQueryRequest request, CancellationToken cancellationToken)
        {
            var result = await _quizResultRepository
                .GetResultWithQuizAndAnswersAsync(request.Id, cancellationToken);

            if (result == null)
            {
                throw new Exception("Quiz result not found");
            }

            var user = await _userRepository.GetByUsernameAsync(result.UserId, cancellationToken);

            var questionsDto = result.Quiz.Questions.Select(q =>
            {
                var userAnswer = result.Answers.FirstOrDefault(a => a.QuestionId == q.Id);

                return new QuestionDto
                {
                    Id = q.Id,
                    Type = q.Type,
                    Text = q.Text,
                    Options = q switch
                    {
                        SingleChoiceQuestion sc => sc.Options,
                        MultipleChoiceQuestion mc => mc.Options,
                        _ => null
                    },
                    UserAnswer = userAnswer?.Answer,
                    CorrectAnswer = q switch
                    {
                        SingleChoiceQuestion sc => sc.CorrectOptionIndex,
                        MultipleChoiceQuestion mc => mc.CorrectOptionIndices,
                        TrueFalseQuestion tf => tf.CorrectAnswer,
                        FillInTheBlankQuestion fb => fb.CorrectAnswer,
                        _ => null
                    },
                    IsCorrect = userAnswer?.IsCorrect ?? false
                };
            }).ToList();

            return new GetQuizResultByIdQueryResponse
            {
                Username = user?.Username ?? "Unknown",
                TimeElapsedSeconds = result.TimeElapsedSeconds,
                CorrectAnswers = result.CorrectAnswers,
                TotalQuestions = result.TotalQuestions,
                Score = result.Score,
                CompletedAt = result.CompletedAt,
                Questions = questionsDto
            };
        }
    }
}
