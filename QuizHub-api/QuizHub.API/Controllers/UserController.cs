using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizHub.API.Service;
using QuizHub.Application.Feature.Token.Command;
using QuizHub.Application.Feature.User.Commands.CreateUser;
using QuizHub.Application.Feature.User.Commands.UpdateUser;
using QuizHub.Application.Feature.User.Queries.GetCurrentUser;
using QuizHub.Application.Feature.User.Quieries.GetUserForGlobalLeaderboard;
using QuizHub.Application.Feature.User.Quieries.GetUserProfilePicture;
using QuizHub.Application.Feature.User.Quieries.GetUserResults;

namespace QuizHub.API.Controllers
{
    [Route("users")]
    [ApiController]
    [Authorize]
    public class UserController : ApiControllerBase
    {
        [HttpPost]
        [Route("create")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateUser([FromForm] CreateUserRequest command, CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }

        [HttpPost]
        [Route("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] CreateTokenRequest command, CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }

        [HttpGet]
        [Route("profilepicture")]
        public async Task<IActionResult> GetUserProfilePicture(CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(new GetUserProfilePictureRequest() { Username = IdentityService.Username }, cancellationToken);
            return Ok(result);
        }

        [HttpGet]
        [Route("current")]
        public async Task<IActionResult> GetCurrentUser(CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(new GetCurrentUserRequest() { Username = IdentityService.Username }, cancellationToken);
            return Ok(result);
        }

        [HttpPut]
        [Route("update")]
        public async Task<IActionResult> UpdateUser([FromForm] UpdateUserRequest command, CancellationToken cancellationToken)
        {
            command.Username = IdentityService.Username;
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }

        [HttpGet]
        [Route("result/{userId}")]
        public async Task<IActionResult> GetUserResult(string userId, CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(new GetUserResultsQueryRequest(IdentityService.Username), cancellationToken);
            return Ok(result);
        }

        [HttpGet]
        [Route("global-leaderboard")]
        public async Task<IActionResult> GetUserLeaderboard(CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(new GetUserForGlobalLeaderboardQueryRequest(), cancellationToken);
            return Ok(result);
        }
    }
}