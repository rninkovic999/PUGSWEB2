using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Loby.Commands.JoinLobby
{
    public class JoinLobbyCommand : IRequest
    {
        public string LobbyId { get; set; }
        public string Username { get; set; }

        public JoinLobbyCommand(string lobbyId, string username)
        {
            LobbyId = lobbyId;
            Username = username;
        }
    }
}
