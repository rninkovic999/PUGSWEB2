using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.QuizResult.Queries.GetQuizResultById
{
    public class GetQuizResultByIdQueryRequest : IRequest<GetQuizResultByIdQueryResponse>
    {
        public GetQuizResultByIdQueryRequest(string id)
        {
            Id = id;
        }

        public string Id { get; set; } = string.Empty;
    }

    public class GetQuizResultByIdQueryResponse
    {
        public string Username { get; set; } = string.Empty;
        public int TimeElapsedSeconds { get; set; }
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public double Score { get; set; }
        public DateTime CompletedAt { get; set; }

        public List<QuestionDto> Questions { get; set; } = new();
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
}
