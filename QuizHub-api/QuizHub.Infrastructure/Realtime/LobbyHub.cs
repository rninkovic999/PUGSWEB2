using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using QuizHub.Domain.Contracts;
using QuizHub.Domain.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace QuizHub.Infrastructure.Realtime
{
    [Authorize]
    public class LobbyHub : Hub
    {
        private readonly ILobyRepository _lobyRepository;
        private readonly IUserRepository _userRepository;
        public LobbyHub(ILobyRepository lobyRepository, IUserRepository userRepository)
        {
            _lobyRepository = lobyRepository;
            _userRepository = userRepository;
        }
        public async Task JoinLobby(string lobbyId)
        {
            var lobby = await _lobyRepository.GetLobyByIdAsync(lobbyId);
            if (lobby == null)
            {
                throw new HubException("Lobby not found.");
            }
            if (!lobby.IsActive || lobby.StartAt < DateTime.UtcNow)
            {
                throw new HubException("Lobby is not active or has already started.");
            }

            var username = Context.User?.Identity?.Name ?? "Unknown";
            var user = await _userRepository.GetUserByUsernameAsync(username);
            if (user == null)
            {
                throw new HubException("User not found.");
            }
            if (lobby.Participants.Any(p => p.Id == user.Id))
            {
                throw new HubException("User already in the lobby.");
            }

            lobby.Participants.Add(user);
            await _lobyRepository.UpdateLobyAsync(lobby);

            await Groups.AddToGroupAsync(Context.ConnectionId, lobbyId);

        }

        public async Task LeaveLobby(string lobbyId)
        {
            var username = Context.User?.Identity?.Name ?? "Unknown";
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null)
            {
                throw new HubException("User not found.");
            }
            var lobby = await _lobyRepository.GetLobyByIdAsync(lobbyId);
            if (lobby == null)
            {
                throw new HubException("Lobby not found.");
            }
            if (!lobby.Participants.Any(p => p.Id == user.Id))
            {
                throw new HubException("User not in the lobby.");
            }

            var participantToRemove = lobby.Participants.FirstOrDefault(p => p.Id == user.Id);
            if (participantToRemove != null)
            {
                lobby.Participants.Remove(participantToRemove);
            }

            await _lobyRepository.UpdateLobyAsync(lobby);

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, lobbyId);
            await Clients.Group(lobbyId).SendAsync("UserLeft", username);
        }

        public async Task SubmitAnswer(SubmitAnswerDto dto)
        {
            var username = Context.User?.Identity?.Name;
            if (string.IsNullOrEmpty(username))
                throw new HubException("Unauthorized");

            var user = await _userRepository.GetUserByUsernameAsync(username);
            if (user == null)
                throw new HubException("User not found");

            var lobby = await _lobyRepository.GetLobyQuizByIdAsync(dto.LobbyId);
            if (lobby == null)
                throw new HubException("Lobby not found");

            var question = lobby.Quiz?.Questions.FirstOrDefault(q => q.Id == dto.QuestionId);
            if (question == null)
                throw new HubException("Question not found");

            object? convertedAnswer = null;
            if (dto.Answer is JsonElement jsonElement)
            {
                convertedAnswer = question.Type switch
                {
                    "SingleChoice" => jsonElement.GetInt32(),
                    "MultipleChoice" => JsonSerializer.Deserialize<List<int>>(jsonElement.GetRawText()),
                    "TrueFalse" => jsonElement.GetBoolean(),
                    "FillInTheBlank" => jsonElement.GetString(),
                    _ => null
                };
            }
            else
            {
                convertedAnswer = dto.Answer; // Ako je već pravog tipa
            }

            bool isCorrect = question.IsCorrect(convertedAnswer);

            if (!isCorrect)
                return; // netačan odgovor -> ne radimo ništa

            if (!Guid.TryParse(dto.QuestionId.ToString(), out Guid questionId))
                throw new HubException("Invalid QuestionId");
            // Inicijalizuj ako nema
            if (!lobby.Scores.ContainsKey(username))
                lobby.Scores[username] = 0;

            if (!lobby.CorrectAnswers.ContainsKey(questionId))
                lobby.CorrectAnswers[questionId] = new List<string>();

            int pointsToAdd = 0;

            if (!lobby.CorrectAnswers[questionId].Any())
            {
                // Prvi tačan odgovor
                pointsToAdd = 2;
            }
            else if (!lobby.CorrectAnswers[questionId].Contains(username))
            {
                // Sledeći tačni odgovori
                pointsToAdd = 1;
            }

            if (pointsToAdd > 0)
            {
                lobby.Scores[username] += pointsToAdd;
                lobby.CorrectAnswers[questionId].Add(username);

                // Sačuvaj u bazi ako treba
                await _lobyRepository.UpdateLobyAsync(lobby);

                // Pošalji svim klijentima update
                await Clients.Group(dto.LobbyId).SendAsync("ScoreUpdated", new
                {
                    username,
                    score = lobby.Scores[username]
                });
            }

            //await Clients.Group(dto.LobbyId).SendAsync("Test", isCorrect);

            //var alreadyAnswered = await _lobyRepository.HasUserAnsweredQuestion(dto.LobbyId, dto.QuestionId, user.Id);
            //if (alreadyAnswered)
            //throw new HubException("Answer already submitted for this question.");
            // Ovde prosledi answer CQRS handleru ili servisu
            // Npr: IAnswerService.ProcessAnswer(dto, userId)

            // Možeš koristiti neki medijator ovde ako koristiš CQRS pattern
            // await _mediator.Send(new SubmitAnswerCommand(...));
        }
    }
}
