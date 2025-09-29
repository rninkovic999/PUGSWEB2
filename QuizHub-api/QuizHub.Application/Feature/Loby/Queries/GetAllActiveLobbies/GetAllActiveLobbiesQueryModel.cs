using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Loby.Queries.GetAllActiveLobbies
{
    public class GetAllActiveLobbiesQueryRequest : IRequest<GetAllActiveLobbiesQueryResponse>
    {
    }
    public class GetAllActiveLobbiesQueryResponse
    {
        public IEnumerable<GetAllActiveLobbiesQueryDto> Lobbies { get; set; } = new List<GetAllActiveLobbiesQueryDto>();
    }
    public class GetAllActiveLobbiesQueryDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int TimePreQuestionLimitSeconds { get; set; }
        public string QuizTile { get; set; } = string.Empty;
        public DateTime StartAt { get; set; }
        public bool IsActive { get; set; }
    }
}
