using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Quiz.Commands.DeleteQuiz
{
    public class DeleteQuizCommandRequest : IRequest<DeleteQuizCommandResponse>
    {
        public DeleteQuizCommandRequest(string quizId, string username)
        {
            QuizId = quizId;
            Username = username;
        }
        public string QuizId { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
    }
    public class DeleteQuizCommandResponse
    {
        public string Message { get; set; } = string.Empty;
        public bool Success { get; set; } = false;
    }
}
