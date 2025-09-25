using MediatR;
using QuizHub.Application.Common.Exceptions;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Question.Commands.DeleteQuestion
{
    public class DeleteQuestionCommandHandler : IRequestHandler<DeleteQuestionCommandRequest, DeleteQuestionCommandResponse>
    {
        private readonly IQuestionRepository _questionRepository;
        private readonly IQuizRepository _quizRepository;
        public DeleteQuestionCommandHandler(IQuestionRepository questionRepository, IQuizRepository quizRepository)
        {
            _questionRepository = questionRepository ?? throw new ArgumentNullException(nameof(questionRepository));
            _quizRepository = quizRepository ?? throw new ArgumentNullException(nameof(quizRepository));
        }

        public async Task<DeleteQuestionCommandResponse> Handle(DeleteQuestionCommandRequest request, CancellationToken cancellationToken)
        {
            
            var question = await _questionRepository.GetQuestionByIdAsync(request.QuestionId, cancellationToken);
            
            if (question == null)
            {
                throw new NotFoundException("question", request.QuestionId);
            }
            
            var quiz = await _quizRepository.GetQuizByIdAsync(question.QuizId, cancellationToken);

            if (quiz == null)
            {
                throw new NotFoundException("quiz", question.QuizId);
            }

            if (quiz.CreatedByUserId != request.Username)
            {
                throw new UnauthorizedAccessException("You do not have permission to delete this question.");
            }

            var result = await _questionRepository.DeleteQuestionAsync(request.QuestionId, cancellationToken);
            
            if (result)
            {
                return new DeleteQuestionCommandResponse
                {
                    Success = true,
                    Message = "Question deleted successfully."
                };
            }
            
            throw new Exception("Failed to delete question. Please try again later.");
        }
    }
}
