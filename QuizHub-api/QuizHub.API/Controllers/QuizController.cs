using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizHub.Application.Feature.Quiz.Commands.CreateQuiz;
using QuizHub.Application.Feature.Quiz.Commands.DeleteQuiz;
using QuizHub.Application.Feature.Quiz.Commands.UpdateQuiz;
using QuizHub.Application.Feature.Quiz.Queries.GetAllQuizzes;
using QuizHub.Application.Feature.Quiz.Queries.GetAllQuizzesByCreatedById;
using QuizHub.Application.Feature.Quiz.Queries.GetQuizWithQuestionsAndAnswersById;
using QuizHub.Application.Feature.Quiz.Queries.GetQuizWithQuestionsById;
using QuizHub.Application.Feature.Quiz.Queries.GetQuizzesCategory;
using QuizHub.Application.Feature.Quiz.Queries.GetQuizzesTitle;

namespace QuizHub.API.Controllers
{
    [Route("quiz")]
    [ApiController]
    [Authorize]
    public class QuizController : ApiControllerBase
    {
        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateQuizAsync([FromBody] CreateQuizDto dto, CancellationToken cancellationToken)
        {
            var userId = IdentityService.Username;

            var command = new CreateQuizCommandRequest(
                userId,
                dto.Title,
                dto.Category,
                dto.Description,
                dto.TimeLimitSeconds,
                dto.Difficulty
            );

            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }
        [HttpGet("get-all-quizzes-by-created-by-id/admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllQuizzesByCreatedByIdAsync(CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(new GetAllQuizzesByCreatedByIdRequest() { CreatedById = IdentityService.Username }, cancellationToken);
            return Ok(result);
        }
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllQuizzesAsync(
            [FromQuery] string? keyword,
            [FromQuery] string? category,
            [FromQuery] int? difficulty, 
            CancellationToken cancellationToken)
        {
            var query = new GetAllQuizzesQueryRequest
            {
                Keyword = keyword,
                Category = category,
                Difficulty = difficulty
            };

            var result = await Mediator.Send(query, cancellationToken);
            return Ok(result);
        }
        [HttpGet("get-all-categories")]
        public async Task<IActionResult> GetAllCategoriesAsync(CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(new GetQuizzesCategoryQueryRequest(), cancellationToken);
            return Ok(result);
        }

        [HttpDelete("delete/{quizId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteQuizAsync(string quizId, CancellationToken cancellationToken)
        {
            var command = new DeleteQuizCommandRequest(quizId, IdentityService.Username);
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }
        [HttpGet("get-by-id-questions/{quizId}")]
        public async Task<IActionResult> GetQuizByQuestionsIdAsync(string quizId, CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(new GetQuizWithQuestionsByIdQueryRequest(quizId), cancellationToken);
            return Ok(result);
        }
        [HttpGet("get-by-id-questions/answers/{quizId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetQuizByQuestionsAndAnswersIdAsync(string quizId, CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(new GetQuizWithQuestionsAndAnswersByIdQueryRequest(quizId, IdentityService.Username), cancellationToken);
            return Ok(result);
        }
        [HttpPut("update/{quizId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateQuizAsync(string quizId, [FromBody] UpdateQuizDto dto, CancellationToken cancellationToken)
        {
            var userId = IdentityService.Username;
            var command = new UpdateQuizCommandRequest(quizId, userId)
            {
                Title = dto.Title,
                Description = dto.Description,
                Category = dto.Category,
                TimeLimitSeconds = dto.TimeLimitSeconds,
                Difficulty = dto.Difficulty,
                Questions = dto.Questions.Select(q => new UpdateQuestionDto
                {
                    Id = q.Id,
                    Text = q.Text,
                    Type = q.Type,
                    Options = q.Options,
                    CorrectOptionIndex = q.CorrectOptionIndex,
                    CorrectOptionIndices = q.CorrectOptionIndices,
                    CorrectAnswerBool = q.CorrectAnswerBool,
                    CorrectAnswerText = q.CorrectAnswerText
                }).ToList()
            };
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }
        [HttpGet("get-all-titles")]
        public async Task<IActionResult> GetAlltitlesAsync(CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(new GetQuizzesTitleQueryRequest(), cancellationToken);
            return Ok(result);
        }
    }
}
