using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Question.Commands.CreateQuestion
{
    public class CreateQuestionCommandRequest : IRequest<CreateQuestionCommandResponse>
    {
        public string QuizId { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; 

        public List<string>? Options { get; set; } 
        public int? CorrectOptionIndex { get; set; } 
        public List<int>? CorrectOptionIndices { get; set; }
        public bool? CorrectAnswerBool { get; set; }
        public string? CorrectAnswerText { get; set; }
    }
    
    public class CreateQuestionCommandResponse
    {
        public string QuestionId { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool Success { get; set; } = false;
    }
}
