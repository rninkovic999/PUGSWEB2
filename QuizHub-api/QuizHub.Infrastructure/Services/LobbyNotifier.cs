using Microsoft.AspNetCore.SignalR;
using QuizHub.Domain.Contracts;
using QuizHub.Infrastructure.Realtime;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Infrastructure.Services
{
    public class LobbyNotifier : ILobbyNotifier
    {
        private readonly IHubContext<LobbyHub> _hubContext;

        public LobbyNotifier(IHubContext<LobbyHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task NotifyUserJoinedAsync(string lobbyId, string username)
        {
            await _hubContext.Clients.Group(lobbyId).SendAsync("UserJoined", username);
        }
    }
}
