using MediatR;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.QuizResult.Queries.GetTopResultsForQuiz
{
    public class GetTopResultsForQuizQueryHandler : IRequestHandler<GetTopResultsForQuizQueryRequest, GetTopResultsForQuizQueryResponse>
    {
        private readonly IQuizResultRepository _quizResultRepository;
        private readonly IUserRepository _userRepository;

        public GetTopResultsForQuizQueryHandler(IQuizResultRepository quizResultRepository, IUserRepository userRepository)
        {
            _quizResultRepository = quizResultRepository;
            _userRepository = userRepository;
        }

        public async Task<GetTopResultsForQuizQueryResponse> Handle(GetTopResultsForQuizQueryRequest request, CancellationToken cancellationToken)
        {
            var results = await _quizResultRepository.GetResultsByQuizIdAsync(request.QuizId, cancellationToken);

            results = request.Period.ToLower() switch
            {
                "weekly" => results.Where(r => r.CompletedAt >= DateTime.UtcNow.AddDays(-7)),
                "monthly" => results.Where(r => r.CompletedAt >= DateTime.UtcNow.AddMonths(-1)),
                _ => results
            };

            var sorted = results
                .OrderByDescending(r => r.Score)
                .ThenBy(r => r.TimeElapsedSeconds)
                .ThenByDescending(r => r.CompletedAt)
                .ToList();

            var users = await _userRepository.GetAllAsync(cancellationToken);

            var entries = sorted.Select((r, index) => new LeaderboardEntryDto
            {
                Position = index + 1,
                Username = users.FirstOrDefault(u => u.Username == r.UserId)?.Username ?? "Unknown",
                Score = (int)Math.Round(r.Score),
                TimeElapsedSeconds = r.TimeElapsedSeconds,
                CompletedAt = r.CompletedAt
            }).ToList();

            return new GetTopResultsForQuizQueryResponse { Entries = entries };
        }
    }
}
