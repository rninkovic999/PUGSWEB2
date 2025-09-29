using MediatR;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Loby.Queries.GetAllActiveLobbies
{
    public class GetAllActiveLobbiesQueryHandler : IRequestHandler<GetAllActiveLobbiesQueryRequest, GetAllActiveLobbiesQueryResponse>
    {
        private readonly ILobyRepository _lobyRepository;
        public GetAllActiveLobbiesQueryHandler(ILobyRepository lobyRepository)
        {
            _lobyRepository = lobyRepository ?? throw new ArgumentNullException(nameof(lobyRepository));
        }
        public async Task<GetAllActiveLobbiesQueryResponse> Handle(GetAllActiveLobbiesQueryRequest request, CancellationToken cancellationToken)
        {
            var activeLobbies = await _lobyRepository.GetAllActiveLobbiesAsync(cancellationToken);

            var mappedLobbies = activeLobbies.Select(l => new GetAllActiveLobbiesQueryDto
            {
                Id = l.Id,
                Name = l.Name,
                TimePreQuestionLimitSeconds = l.TimePreQuestionLimitSeconds,
                QuizTile = l.QuizTile,
                StartAt = l.StartAt,
                IsActive = l.IsActive
            });

            return new GetAllActiveLobbiesQueryResponse
            {
                Lobbies = mappedLobbies
            };
        }
    }
}
