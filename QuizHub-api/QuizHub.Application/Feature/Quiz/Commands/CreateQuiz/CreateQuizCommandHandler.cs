using MediatR;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Quiz.Commands.CreateQuiz
{
    public class CreateQuizCommandHandler : IRequestHandler<CreateQuizCommandRequest, CreateQuizCommandResponse>
    {
        private readonly IQuizRepository _quizRepository;
        public CreateQuizCommandHandler(IQuizRepository quizRepository)
        {
            _quizRepository = quizRepository ?? throw new ArgumentNullException(nameof(quizRepository));
        }
        public async Task<CreateQuizCommandResponse> Handle(CreateQuizCommandRequest request, CancellationToken cancellationToken)
        {
            
            var quiz = new Domain.Entities.Quiz
            {
                Id = Guid.NewGuid().ToString(),
                Title = request.Title,
                Description = request.Description,
                Category = request.Category,
                TimeLimitSeconds = request.TimeLimitSeconds,
                Difficulty = request.Difficulty,
                CreatedByUserId = request.UserId
            };
            var result = await _quizRepository.CreateQuizAsync(quiz, cancellationToken);
             
            if (result)
            {
                return new CreateQuizCommandResponse
                {
                    Success = true,
                    Message = "Quiz created successfully.",
                    QuizId = quiz.Id
                };
            }
            
            throw new Exception("Failed to create quiz. Please try again later.");
        }
    }
}
