using MediatR;
using QuizHub.Application.Common.Mappings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.QuizResult.Queries.GetQuizResultByquizId
{
    public class GetQuizResultByquizIdQueryRequest : IRequest<IEnumerable<GetQuizResultByquizIdQueryResponse>>
    {
        public GetQuizResultByquizIdQueryRequest(string quizId)
        {
            QuizId = quizId;
        }
        public string QuizId { get; set; } = string.Empty;
    }
    public class GetQuizResultByquizIdQueryResponse : IMapFrom<Domain.Entities.QuizResult>
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public int TotalQuestions { get; set; } 
        public int CorrectAnswers { get; set; }
        public double Score { get; set; }
        public int TimeElapsedSeconds { get; set; }

        public DateTime CompletedAt { get; set; } = DateTime.UtcNow;

    }
}
