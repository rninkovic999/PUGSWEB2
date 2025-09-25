using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.User.Quieries.GetUserResults
{
    public class GetUserResultsQueryRequest : IRequest<GetUserResultsQueryResponse>
    {
        public GetUserResultsQueryRequest(string userId)
        {
            UserId = userId;
        }
        public string UserId { get; set; } = string.Empty;
    }
    public class GetUserResultsQueryResponse
    {
        public List<UserResultDto> Results { get; set; } = new();
        public string Message { get; set; } = string.Empty;
        public bool Success { get; set; }
    }
    public class UserResultDto
    {
        public string ResultId { get; set; } = string.Empty;
        public string QuizId { get; set; } = string.Empty;
        public string QuizTitle { get; set; } = string.Empty;
        public DateTime CompletedAt { get; set; }
        public double Score { get; set; }
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
    }

}
