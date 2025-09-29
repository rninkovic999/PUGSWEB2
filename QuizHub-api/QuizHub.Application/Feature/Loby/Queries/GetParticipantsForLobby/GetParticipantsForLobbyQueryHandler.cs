using MediatR;
using QuizHub.Application.Common.Exceptions;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Loby.Queries.GetParticipantsForLobby
{
    public class GetParticipantsForLobbyQueryHandler : IRequestHandler<GetParticipantsForLobbyQueryRequest, GetParticipantsForLobbyQueryResponse>
    {
        private readonly ILobyRepository _lobbyRepository;
        public GetParticipantsForLobbyQueryHandler(ILobyRepository lobbyRepository)
        {
            _lobbyRepository = lobbyRepository ?? throw new ArgumentNullException(nameof(lobbyRepository));
        }
        public async Task<GetParticipantsForLobbyQueryResponse> Handle(GetParticipantsForLobbyQueryRequest request, CancellationToken cancellationToken)
        {
            var lobby = await _lobbyRepository.GetLobyByIdAsync(request.LobbyId);
            if (lobby == null)
            {
                throw new NotFoundException("Lobby", request.LobbyId);
            }
            var response = new GetParticipantsForLobbyQueryResponse
            {
                Usernames = lobby.Participants.Select(p => p.Username).ToList(),
                StartAt = lobby.StartAt
            };
            return response;

        }
    }
}
