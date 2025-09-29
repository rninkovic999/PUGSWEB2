using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Quiz.Queries.GetQuizzesTitle
{
    public class GetQuizzesTitleQueryRequest : IRequest<GetQuizzesTitleQueryResponse>
    {
    }

    public class GetQuizzesTitleQueryResponse
    {
        public List<string> QuizzesTitles { get; set; } = new List<string>();
        public string Message { get; set; } = string.Empty;
        public bool Success { get; set; } = false;
    }
}
