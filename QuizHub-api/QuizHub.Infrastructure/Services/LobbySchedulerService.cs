using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Infrastructure.Services
{
    public class LobbySchedulerService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public LobbySchedulerService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _scopeFactory.CreateScope();

                var lobyRepo = scope.ServiceProvider.GetRequiredService<ILobyRepository>();
                var questionSender = scope.ServiceProvider.GetRequiredService<IQuestionSenderService>();

                var activeLobbies = await lobyRepo.GetAllActiveLobbiesTrueAsync(stoppingToken);

                foreach (var lobby in activeLobbies)
                {
                    if (lobby.StartAt <= DateTime.UtcNow && lobby.IsActive)
                    {
                        lobby.IsActive = false;
                        await lobyRepo.UpdateLobyAsync(lobby);
                        _ = questionSender.StartQuestionFlowAsync(lobby.Id, stoppingToken);
                    }
                }

                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
        }
    }
}
