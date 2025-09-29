using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Contracts
{
    public interface IQuestionSenderService
    {
        Task StartQuestionFlowAsync(string lobbyId, CancellationToken cancellationToken);
    }
}
