using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizHub.Application.Feature.Loby.Commands.CreateLoby;
using QuizHub.Application.Feature.Loby.Commands.JoinLobby;
using QuizHub.Application.Feature.Loby.Queries.GetAllActiveLobbies;
using QuizHub.Application.Feature.Loby.Queries.GetParticipantsForLobby;
using QuizHub.Application.Feature.Question.Commands.CreateQuestion;

namespace QuizHub.API.Controllers
{
    [Route("lobby")]
    [ApiController]
    [Authorize]
    public class LobbyController : ApiControllerBase
    {
        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateLobyAsync([FromBody] CreateLobyDto dto, CancellationToken cancellationToken)
        {
            var userId = IdentityService.Username;
            var commandRequest = new CreateLobyCommandRequest(
                userId,
                dto.Name,
                dto.QuizTitle,
                dto.TimePreQuestionLimitSeconds,
                dto.StartAt
            );

            var result = await Mediator.Send(commandRequest, cancellationToken);
            return Ok(result);
        }
        [HttpGet("active")]
        public async Task<IActionResult> GetAllActiveLobbiesAsync(CancellationToken cancellationToken)
        {
            var queryRequest = new GetAllActiveLobbiesQueryRequest();
            var result = await Mediator.Send(queryRequest, cancellationToken);
            return Ok(result);
        }
        [HttpPost("{lobbyId}/join")]
        public async Task<IActionResult> JoinLobbyAsync(string lobbyId, CancellationToken cancellationToken)
        {
            var username = IdentityService.Username;

            var command = new JoinLobbyCommand(lobbyId, username);

            await Mediator.Send(command, cancellationToken);
            return Ok();
        }
        [HttpGet("participants/{lobbyId}")]
        public async Task<IActionResult> GetParticipantsForLobbyAsync(string lobbyId, CancellationToken cancellationToken)
        {
            var queryRequest = new GetParticipantsForLobbyQueryRequest(lobbyId);
            var result = await Mediator.Send(queryRequest, cancellationToken);
            return Ok(result);
        }
    }
}
