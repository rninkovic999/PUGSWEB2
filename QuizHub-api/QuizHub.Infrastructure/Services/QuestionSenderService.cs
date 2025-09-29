using Microsoft.AspNetCore.SignalR;
using QuizHub.Domain.Contracts;
using QuizHub.Domain.Entities;
using QuizHub.Infrastructure.Realtime;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Infrastructure.Services
{
    public class QuestionSenderService : IQuestionSenderService
    {
        private readonly IHubContext<LobbyHub> _hubContext;
        private readonly ILobyRepository _lobyRepository;
        private readonly IQuizRepository _quizRepository;

        public QuestionSenderService(
            IHubContext<LobbyHub> hubContext,
            ILobyRepository lobyRepository,
            IQuizRepository quizRepository)
        {
            _hubContext = hubContext;
            _lobyRepository = lobyRepository;
            _quizRepository = quizRepository;
        }

        public async Task StartQuestionFlowAsync(string lobbyId, CancellationToken cancellationToken)
        {
            var lobby = await _lobyRepository.GetLobyQuizByIdAsync(lobbyId);
            if (lobby == null || lobby.Quiz == null)
                return;

            var questions = lobby.Quiz.Questions.OrderBy(q => q.Id).ToList();
            int delay = lobby.TimePreQuestionLimitSeconds * 1000;

            for (int i = 0; i < questions.Count; i++)
            {
                var question = questions[i];

                object payload = question switch
                {
                    SingleChoiceQuestion scq => new
                    {
                        Index = i + 1,
                        QuestionId = scq.Id,
                        Type = scq.Type,
                        Text = scq.Text,
                        Options = scq.Options
                    },
                    MultipleChoiceQuestion mcq => new
                    {
                        Index = i + 1,
                        QuestionId = mcq.Id,
                        Type = mcq.Type,
                        Text = mcq.Text,
                        Options = mcq.Options
                    },
                    TrueFalseQuestion tfq => new
                    {
                        Index = i + 1,
                        QuestionId = tfq.Id,
                        Type = tfq.Type,
                        Text = tfq.Text
                        // mozes dodati i `Options = new[] { "True", "False" }` ako frontend to koristi
                    },
                    FillInTheBlankQuestion fibq => new
                    {
                        Index = i + 1,
                        QuestionId = fibq.Id,
                        Type = fibq.Type,
                        Text = fibq.Text
                        // Nema options
                    },
                    _ => new
                    {
                        Index = i + 1,
                        QuestionId = question.Id,
                        Type = question.Type,
                        Text = question.Text
                    }
                };

                await _hubContext.Clients.Group(lobbyId).SendAsync("ReceiveQuestion", payload, cancellationToken);

                await Task.Delay(delay, cancellationToken);
            }

            await _hubContext.Clients.Group(lobbyId).SendAsync("QuizCompleted", cancellationToken);
        }
    }
}
