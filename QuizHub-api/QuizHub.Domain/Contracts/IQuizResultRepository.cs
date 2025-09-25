using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Contracts
{
    public interface IQuizResultRepository
    {
        Task<bool> AddAsync(QuizResult quizResult, CancellationToken cancellationToken);
        Task<List<QuizResult>> GetResultsByUserIdAsync(string userId, CancellationToken cancellationToken);
        Task<QuizResult?> GetResultWithQuizAndAnswersAsync(string resultId, CancellationToken cancellationToken);
        Task<List<QuizResult>> GetAllAttemptsByUserAndQuizAsync(string userId, string quizId, CancellationToken cancellationToken);
        Task<IEnumerable<QuizResult>> GetResultsByQuizIdAsync(string quizId, CancellationToken cancellationToken);

    }
}
