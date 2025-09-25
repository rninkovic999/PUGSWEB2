using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Quiz.Commands.CreateQuiz
{
    public class CreateQuizCommandRequest : IRequest<CreateQuizCommandResponse>
    {
        public CreateQuizCommandRequest(string userId, string title,string category, string? description, int timeLimitSeconds, int difficulty)
        {
            UserId = userId;
            Title = title;
            Description = description;
            Category = category;
            TimeLimitSeconds = timeLimitSeconds;
            Difficulty = difficulty;
        }

        public string UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = string.Empty;
        public int TimeLimitSeconds { get; set; }
        public int Difficulty { get; set; }
    }
    public class CreateQuizDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = string.Empty;
        public int TimeLimitSeconds { get; set; }
        public int Difficulty { get; set; }
    }
    public class CreateQuizCommandResponse
    {
        public string QuizId { get; set; } = String.Empty;
        public string Message { get; set; } = String.Empty;
        public bool Success { get; set; } = false;
    }
}
