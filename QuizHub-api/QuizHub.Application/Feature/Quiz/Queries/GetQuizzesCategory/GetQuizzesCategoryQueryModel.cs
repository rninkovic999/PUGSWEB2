using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Quiz.Queries.GetQuizzesCategory
{
    public class GetQuizzesCategoryQueryRequest : IRequest<GetQuizzesCategoryQueryResponse>
    {

    }

    public class GetQuizzesCategoryQueryResponse
    {
        public List<string> Categories { get; set; } = new List<string>();
        public string Message { get; set; } = string.Empty;
        public bool Success { get; set; } = false;
    }
}
