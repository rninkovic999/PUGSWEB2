using MediatR;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Quiz.Queries.GetQuizzesTitle
{
    public class GetQuizzesTitleQueryHandler : IRequestHandler<GetQuizzesTitleQueryRequest, GetQuizzesTitleQueryResponse>
    {
        private readonly IQuizRepository _quizRepository;
        public GetQuizzesTitleQueryHandler(IQuizRepository quizRepository)
        {
            _quizRepository = quizRepository ?? throw new ArgumentNullException(nameof(quizRepository));
        }
        public async Task<GetQuizzesTitleQueryResponse> Handle(GetQuizzesTitleQueryRequest request, CancellationToken cancellationToken)
        {
            var Titles = await _quizRepository.GetAllTitlesAsync(cancellationToken);

            return new GetQuizzesTitleQueryResponse
            {
                QuizzesTitles = Titles,
                Message = "Quizzes titles retrieved successfully.",
                Success = true
            };
        }
    }
}
