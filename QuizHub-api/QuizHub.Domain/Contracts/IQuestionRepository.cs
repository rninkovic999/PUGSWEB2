using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Contracts
{
    public interface IQuestionRepository
    {
        Task<bool> CreateQuestionAsync(Question question, CancellationToken cancellationToken);
        Task<bool> UpdateQuestionAsync(Question question, CancellationToken cancellationToken);
        Task<bool> DeleteQuestionAsync(string questionId, CancellationToken cancellationToken);
        Task<Question?> GetQuestionByIdAsync(string questionId, CancellationToken cancellationToken);
        Task<IEnumerable<Question>> GetQuestionsByQuizIdAsync(string quizId, CancellationToken cancellationToken);
    }
}
