using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Loby.Queries.GetParticipantsForLobby
{
    public class GetParticipantsForLobbyQueryRequest : IRequest<GetParticipantsForLobbyQueryResponse>
    {
        public GetParticipantsForLobbyQueryRequest(string lobbyId)
        {
            LobbyId = lobbyId ?? throw new ArgumentNullException(nameof(lobbyId));
        }
        public string LobbyId { get; set; } = string.Empty;
    }

    public class GetParticipantsForLobbyQueryResponse
    {
        public List<string> Usernames { get; set; } = new List<string>();
        public DateTime StartAt { get; set; }
    }
}
