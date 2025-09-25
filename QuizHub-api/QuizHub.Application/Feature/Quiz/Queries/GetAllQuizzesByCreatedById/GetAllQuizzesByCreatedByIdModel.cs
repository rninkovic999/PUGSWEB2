using MediatR;
using QuizHub.Application.Common.Mappings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Quiz.Queries.GetAllQuizzesByCreatedById
{
    public class GetAllQuizzesByCreatedByIdRequest : IRequest<IEnumerable<GetAllQuizzesByCreatedByIdResponse>>
    {
        public string CreatedById { get; set; } = string.Empty;
    } 
    public class GetAllQuizzesByCreatedByIdResponse : IMapFrom<QuizHub.Domain.Entities.Quiz>
    {
        public string Id { get; set; } = String.Empty;
        public string Title { get; set; } = String.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = String.Empty;
        public int TimeLimitSeconds { get; set; }
        public int Difficulty { get; set; }
        public string CreatedByUserId { get; set; } = String.Empty;
        public int QuestionCount { get; set; } = 0;
    }
}
