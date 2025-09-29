using MediatR;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Loby.Commands.JoinLobby
{
    public class JoinLobbyCommandHandler : IRequestHandler<JoinLobbyCommand>
    {
        private readonly ILobbyNotifier _notifier;

        public JoinLobbyCommandHandler(ILobbyNotifier notifier)
        {
            _notifier = notifier;
        }

        public async Task Handle(JoinLobbyCommand request, CancellationToken cancellationToken)
        {
            // TODO: Provera da li postoji lobby itd.
            await _notifier.NotifyUserJoinedAsync(request.LobbyId, request.Username);
        }
    }
}
