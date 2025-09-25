using AutoMapper;
using MediatR;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.QuizResult.Queries.GetQuizResultByquizId
{
    public class GetQuizResultByquizIdQueryHandler : IRequestHandler<GetQuizResultByquizIdQueryRequest, IEnumerable<GetQuizResultByquizIdQueryResponse>>
    {
        private readonly IQuizResultRepository _quizResultRepository;
        private readonly IMapper _mapper;

        public GetQuizResultByquizIdQueryHandler(IQuizResultRepository quizResultRepository, IMapper mapper)
        {
            _quizResultRepository = quizResultRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GetQuizResultByquizIdQueryResponse>> Handle(GetQuizResultByquizIdQueryRequest request, CancellationToken cancellationToken)
        {
            var quizResults = await _quizResultRepository.GetResultsByQuizIdAsync(request.QuizId, cancellationToken);
            return _mapper.Map<IEnumerable<GetQuizResultByquizIdQueryResponse>>(quizResults);
        }
    }
}
