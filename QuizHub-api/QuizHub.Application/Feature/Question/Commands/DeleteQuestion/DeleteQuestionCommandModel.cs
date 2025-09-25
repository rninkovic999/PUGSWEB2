using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Question.Commands.DeleteQuestion
{
    public class DeleteQuestionCommandRequest : IRequest<DeleteQuestionCommandResponse>
    {
        public DeleteQuestionCommandRequest(string questionId, string username)
        {
            QuestionId = questionId;
            Username = username;
        }
        public string QuestionId { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
    }   
    public class DeleteQuestionCommandResponse
    {
        public string Message { get; set; } = string.Empty;
        public bool Success { get; set; } = false;
    }
}
