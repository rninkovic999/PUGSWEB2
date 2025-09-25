using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.QuizResult.Queries.GetResultWithAllAttempts
{
    public class GetResultWithAllAttemptsQueryRequest : IRequest<GetResultWithAllAttemptsQueryResponse>
    {
        public string ResultId { get; set; } = string.Empty;
    }

    public class GetResultWithAllAttemptsQueryResponse
    {
        public int TimeElapsedSeconds { get; set; }
        public List<QuestionDto> Questions { get; set; } = new();
        public List<AttemptDto> Attempts { get; set; } = new();

    }
    public class QuestionDto       
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public object? UserAnswer { get; set; }
        public object? CorrectAnswer { get; set; }
        public List<string>? Options { get; set; }
        public bool IsCorrect { get; set; }
    }
    public class AttemptDto
    {
        public int Time { get; set; }
        public int CorrectAnswers { get; set; }
    }
}
