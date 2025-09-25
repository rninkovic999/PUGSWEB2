using MediatR;
using QuizHub.Application.Common.Exceptions;
using QuizHub.Domain.Contracts;
using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.QuizResult.Commands
{
    public class CreateQuizResultCommandHandler : IRequestHandler<CreateQuizResultCommandRequest, CreateQuizResultCommandResponse>
    {
        private readonly IQuizRepository _quizRepository;
        private readonly IQuizResultRepository _quizResultRepository;
        private readonly IQuestionRepository _questionRepository;
        private readonly IUserRepository _userRepository;

        public CreateQuizResultCommandHandler(
            IQuizRepository quizRepository,
            IQuizResultRepository quizResultRepository,
            IQuestionRepository questionRepository,
            IUserRepository userRepository)
        {
            _quizRepository = quizRepository ?? throw new ArgumentNullException(nameof(quizRepository));
            _quizResultRepository = quizResultRepository ?? throw new ArgumentNullException(nameof(quizResultRepository));
            _questionRepository = questionRepository ?? throw new ArgumentNullException(nameof(questionRepository));
            _userRepository = userRepository;
        }
        public async Task<CreateQuizResultCommandResponse> Handle(CreateQuizResultCommandRequest request, CancellationToken cancellationToken)
        {
            var questions = await _questionRepository.GetQuestionsByQuizIdAsync(request.QuizId, cancellationToken);

            if (questions == null || !questions.Any())
            {
                throw new NotFoundException("Quiz", request.QuizId);
            }
 
            var user = await _userRepository.GetByUsernameAsync(request.UserId, cancellationToken);
            if (user == null)
            {
                throw new NotFoundException("User", request.UserId);
            }

            var questionDict = questions.ToDictionary(q => q.Id, q => q);

            int correctCount = 0;
            var userAnswers = new List<Domain.Entities.UserAnswer>();

            var answerDict = request.Answers.ToDictionary(a => a.QuestionId, a => a.Answer);

            foreach (var question in questions)
            {
                object? parsedAnswer = null;
                var hasAnswer = answerDict.TryGetValue(question.Id, out var rawAnswer);

                if (hasAnswer && rawAnswer is JsonElement je)
                {
                    parsedAnswer = question switch
                    {
                        SingleChoiceQuestion => je.ValueKind == JsonValueKind.Number ? je.GetInt32() : null,
                        MultipleChoiceQuestion => je.ValueKind == JsonValueKind.Array ? je.Deserialize<List<int>>() : null,
                        TrueFalseQuestion => je.ValueKind == JsonValueKind.True || je.ValueKind == JsonValueKind.False ? je.GetBoolean() : null,
                        FillInTheBlankQuestion => je.ValueKind == JsonValueKind.String ? je.GetString() : null,
                        _ => null
                    };
                }

                bool isCorrect = hasAnswer && parsedAnswer != null && question.IsCorrect(parsedAnswer);

                if (isCorrect) correctCount++;

                userAnswers.Add(new Domain.Entities.UserAnswer
                {
                    Id = Guid.NewGuid().ToString(),
                    QuestionId = question.Id,
                    IsCorrect = isCorrect,
                    Answer = parsedAnswer
                });
            }

            var result = new Domain.Entities.QuizResult
            {
                Id = Guid.NewGuid().ToString(),
                QuizId = request.QuizId,
                UserId = request.UserId,
                TotalQuestions = questions.Count(),
                CorrectAnswers = correctCount,
                Score = Math.Round((double)correctCount / questions.Count() * 100, 2),
                TimeElapsedSeconds = request.TimeElapsedSeconds,
                CompletedAt = DateTime.UtcNow,
                Answers = userAnswers
            };

            user.GlobalScore += correctCount;
            user.LastUpdatedAt = DateTime.UtcNow;


            var ret1 = await _userRepository.UpdateAsync(user, cancellationToken);

            if (!ret1)
            {
                throw new Exception("Failed to update user score. Please try again later!");
            }
            var ret2 = await _quizResultRepository.AddAsync(result, cancellationToken);

            if (!ret2)
            {
                throw new Exception("Failed to save quiz result. Please try again later!");
            }

            var saved = ret1 && ret2;

            return new CreateQuizResultCommandResponse
            {
                IsSuccess = saved,
                Message = saved ? "Quiz result saved successfully." : "Failed to save result.",
                TotalQuestions = questions.Count(),
                CorrectAnswers = correctCount,
                Score = Math.Round((double)correctCount / questions.Count() * 100, 2),
                Answers = userAnswers.Select(a =>
                {
                    var question = questionDict[a.QuestionId];
                    return new UserAnswerDto
                    {
                        QuestionId = a.QuestionId,
                        Answer = a.Answer,
                        CorrectAnswer = question switch
                        {
                            SingleChoiceQuestion scq => scq.CorrectOptionIndex,
                            MultipleChoiceQuestion mcq => mcq.CorrectOptionIndices.Select(i => i).ToList(),
                            TrueFalseQuestion tfq => tfq.CorrectAnswer,
                            FillInTheBlankQuestion fibq => fibq.CorrectAnswer,
                            _ => null
                        },
                        IsCorrect = a.IsCorrect
                    };
                }).ToList()
            };
        }
    }
}
