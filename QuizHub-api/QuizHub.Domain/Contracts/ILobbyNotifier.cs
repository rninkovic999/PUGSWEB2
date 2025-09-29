using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Contracts
{
    public interface ILobbyNotifier
    {
        Task NotifyUserJoinedAsync(string lobbyId, string username);

    }
}
