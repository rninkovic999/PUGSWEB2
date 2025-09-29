using MediatR;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Loby.Commands.CreateLoby
{
    public class CreateLobyCommandHandler : IRequestHandler<CreateLobyCommandRequest, CreateLobyCommandResponse>
    {
        private readonly ILobyRepository _lobyRepository;
        private readonly IQuizRepository _quizRepository;
        private readonly IUserRepository _userRepository;
        public CreateLobyCommandHandler(ILobyRepository lobyRepository, IQuizRepository quizRepository, IUserRepository userRepository)
        {
            _lobyRepository = lobyRepository ?? throw new ArgumentNullException(nameof(lobyRepository));
            _quizRepository = quizRepository ?? throw new ArgumentNullException(nameof(quizRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        }
        public async Task<CreateLobyCommandResponse> Handle(CreateLobyCommandRequest request, CancellationToken cancellationToken)
        {
            var quiz = await _quizRepository.GetQuizByTitleAsync(request.QuizTitle, cancellationToken);
            if (quiz == null)
            {
                return new CreateLobyCommandResponse
                {
                    Success = false,
                    Message = "Quiz not found."
                };
            }

            var user = await _userRepository.GetByUsernameAsync(request.CreatedByUserId, cancellationToken);
            if (user == null)
            {
                return new CreateLobyCommandResponse
                {
                    Success = false,
                    Message = "User not found."
                };
            }

            var loby = new Domain.Entities.Loby
            {
                Id = Guid.NewGuid().ToString(),
                Name = request.Name,
                QuizId = quiz.Id,
                CreatorId = user.Id,
                TimePreQuestionLimitSeconds = request.TimePreQuestionLimitSeconds,
                QuizTile = request.QuizTitle,
                CreatedAt = DateTime.UtcNow,
                StartAt = request.StartAt,
                IsActive = true
            };

            var result = await _lobyRepository.CreateLobyAsync(loby, cancellationToken);
            if (result)
            {
                return new CreateLobyCommandResponse
                {
                    Success = true,
                    Message = "Loby created successfully."
                };
            }
            else
            {
                return new CreateLobyCommandResponse
                {
                    Success = false,
                    Message = "Failed to create loby."
                };
            }
        }
    }
}
