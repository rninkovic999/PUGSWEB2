using AutoMapper;
using MediatR;
using QuizHub.Application.Common.Exceptions;
using QuizHub.Application.Common.Mappings;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Quiz.Queries.GetQuizWithQuestionsById
{
    public class GetQuizWithQuestionsByIdQueryHandler : IRequestHandler<GetQuizWithQuestionsByIdQueryRequest, GetQuizWithQuestionsByIdQueryResponse>
    {
        private readonly IQuizRepository _quizRepository;
        private readonly IMapper _mapper;
        public GetQuizWithQuestionsByIdQueryHandler(IQuizRepository quizRepository, IMapper mapper)
        {
            _quizRepository = quizRepository ?? throw new ArgumentNullException(nameof(quizRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        public async Task<GetQuizWithQuestionsByIdQueryResponse> Handle(GetQuizWithQuestionsByIdQueryRequest request, CancellationToken cancellationToken)
        {
            
            var quiz = await _quizRepository.GetQuizByIdAsync(request.QuizId, cancellationToken);
            
            if (quiz == null)
            {
                throw new NotFoundException("quiz", request.QuizId);
            }

            return _mapper.Map<GetQuizWithQuestionsByIdQueryResponse>(quiz);
        }
    }
}
