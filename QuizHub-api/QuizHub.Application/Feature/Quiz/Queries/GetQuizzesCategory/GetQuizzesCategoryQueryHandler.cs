using MediatR;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Quiz.Queries.GetQuizzesCategory
{
    public class GetQuizzesCategoryQueryHandler : IRequestHandler<GetQuizzesCategoryQueryRequest, GetQuizzesCategoryQueryResponse>
    {
        private readonly IQuizRepository _quizRepository;
        public GetQuizzesCategoryQueryHandler(IQuizRepository quizRepository)
        {
            _quizRepository = quizRepository ?? throw new ArgumentNullException(nameof(quizRepository));
        }
        public async Task<GetQuizzesCategoryQueryResponse> Handle(GetQuizzesCategoryQueryRequest request, CancellationToken cancellationToken)
        {
            
            var Categories = await _quizRepository.GetAllCategoriesAsync(cancellationToken);
            if (Categories == null || !Categories.Any())
            {
                return new GetQuizzesCategoryQueryResponse
                {
                    Categories = new List<string>(),
                    Message = "No categories found.",
                    Success = true
                };
            }
            return new GetQuizzesCategoryQueryResponse
            {
                Categories = Categories,
                Message = "Categories retrieved successfully.",
                Success = true
            };

            throw new Exception("Failed to get quizzes. Please try again later.");
        }
    }
}
