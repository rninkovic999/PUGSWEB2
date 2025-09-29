using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Loby.Commands.CreateLoby
{
    public class CreateLobyCommandRequest : IRequest<CreateLobyCommandResponse>
    {
        public CreateLobyCommandRequest(string userId, string name, string quizTitle, int timePreQuestionLimitSeconds, DateTime startAt) 
        { 
            CreatedByUserId = userId;
            Name = name;
            QuizTitle = quizTitle;
            TimePreQuestionLimitSeconds = timePreQuestionLimitSeconds;
            StartAt = startAt;
        }
        public string Name { get; set; } = string.Empty;
        public string CreatedByUserId { get; set; } = string.Empty;
        public int TimePreQuestionLimitSeconds { get; set; }
        public string QuizTitle { get; set; } = string.Empty;
        public DateTime StartAt { get; set; }
    }
    public class CreateLobyDto
    {
        public string Name { get; set; } = string.Empty;
        public int TimePreQuestionLimitSeconds { get; set; }
        public string QuizTitle { get; set; } = string.Empty;
        public DateTime StartAt { get; set; }
    }

    public class CreateLobyCommandResponse
    { 
        public string Message { get; set; } = string.Empty;
        public bool Success { get; set; }
    }
}
