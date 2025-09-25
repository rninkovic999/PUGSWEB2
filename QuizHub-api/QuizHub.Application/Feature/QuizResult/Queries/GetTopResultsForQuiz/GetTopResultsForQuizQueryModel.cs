using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.QuizResult.Queries.GetTopResultsForQuiz
{
    public class GetTopResultsForQuizQueryRequest : IRequest<GetTopResultsForQuizQueryResponse>
    {
        public string QuizId { get; set; } = string.Empty;
        public string Period { get; set; } = "all"; // all, weekly, monthly
    }

    public class GetTopResultsForQuizQueryResponse
    {
        public List<LeaderboardEntryDto> Entries { get; set; } = new();
    }

    public class LeaderboardEntryDto
    {
        public int Position { get; set; }
        public string Username { get; set; } = string.Empty;
        public int Score { get; set; }
        public int TimeElapsedSeconds { get; set; }
        public DateTime CompletedAt { get; set; }
    }
}
