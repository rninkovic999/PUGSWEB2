using AutoMapper;
using MediatR;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Quiz.Queries.GetAllQuizzesByCreatedById
{
    public class GetAllQuizzesByCreatedByIdHandler : IRequestHandler<GetAllQuizzesByCreatedByIdRequest, IEnumerable<GetAllQuizzesByCreatedByIdResponse>>
    {
        private readonly IQuizRepository _quizRepository;
        private readonly IMapper _mapper;
        public GetAllQuizzesByCreatedByIdHandler(IQuizRepository quizRepository, IMapper mapper)
        {
            _quizRepository = quizRepository ?? throw new ArgumentNullException(nameof(quizRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        public async Task<IEnumerable<GetAllQuizzesByCreatedByIdResponse>> Handle(GetAllQuizzesByCreatedByIdRequest request, CancellationToken cancellationToken)
        {
            
            var quizzes = await _quizRepository.GetAllQuizzesByCreatedByIdAsync(request.CreatedById, cancellationToken);
            if (quizzes == null || !quizzes.Any())
            {
                return Enumerable.Empty<GetAllQuizzesByCreatedByIdResponse>();
            }
            var result = quizzes.Select(q => new GetAllQuizzesByCreatedByIdResponse
            {
                Id = q.Id,
                Title = q.Title,
                Description = q.Description,
                TimeLimitSeconds = q.TimeLimitSeconds,
                Difficulty = q.Difficulty,
                Category = q.Category,
                CreatedByUserId = q.CreatedByUserId,
                QuestionCount = q.Questions?.Count ?? 0
            });

            return result;

        }
    }
}
