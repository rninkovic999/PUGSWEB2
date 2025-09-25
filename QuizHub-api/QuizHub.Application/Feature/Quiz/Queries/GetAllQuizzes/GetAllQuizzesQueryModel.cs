using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Quiz.Queries.GetAllQuizzes
{
    public class GetAllQuizzesQueryRequest : IRequest<IEnumerable<GetAllQuizzesQueryResponse>>
    {
        public string? Keyword { get; set; }
        public string? Category { get; set; }
        public int? Difficulty { get; set; }
    }

    public class GetAllQuizzesQueryResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = string.Empty;
        public int TimeLimitSeconds { get; set; }
        public int Difficulty { get; set; }
        public string CreatedByUserId { get; set; } = string.Empty;
        public int QuestionCount { get; set; } = 0;
    }
}
