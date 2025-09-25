using MediatR;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.User.Quieries.GetUserResults
{
    public class GetUserResultsQueryHandler : IRequestHandler<GetUserResultsQueryRequest, GetUserResultsQueryResponse>
    {
        private readonly IQuizResultRepository _quizResultRepository;
        public GetUserResultsQueryHandler(IQuizResultRepository quizResultRepository)
        {
            _quizResultRepository = quizResultRepository ?? throw new ArgumentNullException(nameof(quizResultRepository));
        }
        public async Task<GetUserResultsQueryResponse> Handle(GetUserResultsQueryRequest request, CancellationToken cancellationToken)
        {
            var results = await _quizResultRepository.GetResultsByUserIdAsync(request.UserId, cancellationToken);

            var dtoList = results.Select(r => new UserResultDto
            {
                ResultId = r.Id,
                QuizId = r.QuizId,
                QuizTitle = r.Quiz?.Title ?? "Unknown",
                CompletedAt = r.CompletedAt,
                Score = r.Score,
                TotalQuestions = r.TotalQuestions,
                CorrectAnswers = r.CorrectAnswers
            }).ToList();

            return new GetUserResultsQueryResponse
            {
                Success = true,
                Results = dtoList,
                Message = "Results fetched successfully"
            };
        }
    }
}
