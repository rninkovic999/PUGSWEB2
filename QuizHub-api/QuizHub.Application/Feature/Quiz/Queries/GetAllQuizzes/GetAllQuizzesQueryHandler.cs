using MediatR;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Quiz.Queries.GetAllQuizzes
{
    public class GetAllQuizzesQueryHandler : IRequestHandler<GetAllQuizzesQueryRequest, IEnumerable<GetAllQuizzesQueryResponse>>
    {
        private readonly IQuizRepository _quizRepository;
        public GetAllQuizzesQueryHandler(IQuizRepository quizRepository)
        {
            _quizRepository = quizRepository ?? throw new ArgumentNullException(nameof(quizRepository));
        }
        public async Task<IEnumerable<GetAllQuizzesQueryResponse>> Handle(GetAllQuizzesQueryRequest request, CancellationToken cancellationToken)
        {

            var quizzes = await _quizRepository.GetAllQuizzesFilteredAsync(request.Keyword, request.Category, request.Difficulty, cancellationToken);

            if (quizzes == null || !quizzes.Any())
                return Enumerable.Empty<GetAllQuizzesQueryResponse>();

            return quizzes.Select(q => new GetAllQuizzesQueryResponse
            {
                Id = q.Id,
                Title = q.Title,
                Description = q.Description,
                Category = q.Category,
                TimeLimitSeconds = q.TimeLimitSeconds,
                Difficulty = q.Difficulty,
                CreatedByUserId = q.CreatedByUserId,
                QuestionCount = q.Questions?.Count ?? 0
            });
        }
    }
}
