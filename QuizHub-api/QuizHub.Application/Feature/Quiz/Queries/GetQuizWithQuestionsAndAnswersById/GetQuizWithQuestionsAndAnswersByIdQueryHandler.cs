using AutoMapper;
using MediatR;
using QuizHub.Application.Common.Exceptions;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Quiz.Queries.GetQuizWithQuestionsAndAnswersById
{
    public class GetQuizWithQuestionsAndAnswersByIdQueryHandler : IRequestHandler<GetQuizWithQuestionsAndAnswersByIdQueryRequest, GetQuizWithQuestionsAndAnswersByIdQueryResponse>
    {
        private readonly IQuizRepository _quizRepository;
        private readonly IMapper _mapper;
        public GetQuizWithQuestionsAndAnswersByIdQueryHandler(IQuizRepository quizRepository, IMapper mapper)
        {
            _quizRepository = quizRepository ?? throw new ArgumentNullException(nameof(quizRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        public async Task<GetQuizWithQuestionsAndAnswersByIdQueryResponse> Handle(GetQuizWithQuestionsAndAnswersByIdQueryRequest request, CancellationToken cancellationToken)
        {
            var quiz = await _quizRepository.GetQuizByIdAsync(request.QuizId, cancellationToken);
            if (quiz == null)
            {
                throw new NotFoundException("quiz", request.QuizId);
            }
            if(quiz.CreatedByUserId != request.Username)
            {
                throw new UnauthorizedException("You do not have permission to view this quiz.");
            }

            return _mapper.Map<GetQuizWithQuestionsAndAnswersByIdQueryResponse>(quiz);
        }
    }
}
