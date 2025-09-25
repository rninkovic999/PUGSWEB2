using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Quiz.Commands.UpdateQuiz
{
    public class UpdateQuizCommandRequest : IRequest<UpdateQuizCommandResponse>
    {
        public UpdateQuizCommandRequest(string id, string username)
        {
            Id = id;
            CreatedByUserId = username;
        }
        public string Id { get; set; } = string.Empty;
        public string CreatedByUserId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = string.Empty;
        public int TimeLimitSeconds { get; set; }
        public int Difficulty { get; set; }
        public List<UpdateQuestionDto>? Questions { get; set; } = new List<UpdateQuestionDto>();
    }
    public class UpdateQuestionDto
    {
        public string Id { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public List<string>? Options { get; set; } = new List<string>();
        public int? CorrectOptionIndex { get; set; }
        public List<int>? CorrectOptionIndices { get; set; }
        public bool? CorrectAnswerBool { get; set; }
        public string? CorrectAnswerText { get; set; }
    }
    public class UpdateQuizDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = string.Empty;
        public int TimeLimitSeconds { get; set; }
        public int Difficulty { get; set; }
        public List<UpdateQuestionDto>? Questions { get; set; } = new List<UpdateQuestionDto>();
    }
    public class UpdateQuizCommandResponse
    {
        public string Message { get; set; } = string.Empty;
        public bool Success { get; set; } = false;
    }
}
