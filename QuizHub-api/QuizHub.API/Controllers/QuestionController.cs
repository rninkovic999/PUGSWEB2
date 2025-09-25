using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizHub.Application.Feature.Question.Commands.CreateQuestion;
using QuizHub.Application.Feature.Question.Commands.DeleteQuestion;

namespace QuizHub.API.Controllers
{
    [Route("question")]
    [ApiController]
    [Authorize]
    public class QuestionController : ApiControllerBase
    {
        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreayeQuestionAsync([FromBody] CreateQuestionCommandRequest commandRequest, CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(commandRequest, cancellationToken);
            return Ok(result);
        }
        [HttpDelete("delete/{questionId}")]
        [Authorize (Roles = "Admin")]
        public async Task<IActionResult> DeleteQuestionAsync(string questionId, CancellationToken cancellationToken)
        {
            var command = new DeleteQuestionCommandRequest(questionId, IdentityService.Username);
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }
    }
}
