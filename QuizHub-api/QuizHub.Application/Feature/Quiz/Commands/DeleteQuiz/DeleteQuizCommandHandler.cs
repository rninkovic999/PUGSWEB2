using MediatR;
using QuizHub.Application.Common.Exceptions;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Quiz.Commands.DeleteQuiz
{
    public class DeleteQuizCommandHandler : IRequestHandler<DeleteQuizCommandRequest, DeleteQuizCommandResponse>
    {
        private readonly IQuizRepository _quizRepository;
        public DeleteQuizCommandHandler(IQuizRepository quizRepository)
        {
            _quizRepository = quizRepository ?? throw new ArgumentNullException(nameof(quizRepository));
        }
        public async Task<DeleteQuizCommandResponse> Handle(DeleteQuizCommandRequest request, CancellationToken cancellationToken)
        {
            
            var quiz = await _quizRepository.GetQuizByIdAsync(request.QuizId, cancellationToken);
            
            if (quiz == null)
            {
                throw new NotFoundException("quiz", request.QuizId);
            }
            if (quiz.CreatedByUserId != request.Username)
            {
                throw new UnauthorizedAccessException("You do not have permission to delete this quiz.");
            }

            var result = await _quizRepository.DeleteQuizAsync(request.QuizId, cancellationToken);
            
            if (result)
            {
                return new DeleteQuizCommandResponse
                {
                    Success = true,
                    Message = "Quiz deleted successfully."
                };
            }            
            
            throw new Exception("Failed to delete quiz. Please try again later.");
        }
    }
}
