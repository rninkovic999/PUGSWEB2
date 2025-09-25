using Microsoft.EntityFrameworkCore;
using QuizHub.Domain.Contracts;
using QuizHub.Domain.Entities;
using QuizHub.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Infrastructure.Repository
{
    public class QuizResultRepository : IQuizResultRepository
    {
        private readonly AppDbContext _context;
        public QuizResultRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }
        public async Task<bool> AddAsync(QuizResult quizResult, CancellationToken cancellationToken)
        {
            await _context.QuizResults.AddAsync(quizResult, cancellationToken);
            return await _context.SaveChangesAsync(cancellationToken) > 0;
        }

        public async Task<List<QuizResult>> GetAllAttemptsByUserAndQuizAsync(string userId, string quizId, CancellationToken cancellationToken)
        {
            return await _context.QuizResults
               .Where(qr => qr.UserId == userId && qr.QuizId == quizId)
               .OrderBy(qr => qr.CompletedAt)
               .ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<QuizResult>> GetResultsByQuizIdAsync(string quizId, CancellationToken cancellationToken)
        {
            return await _context.QuizResults
                .Where(qr => qr.QuizId == quizId)
                .OrderByDescending(qr => qr.Score)
                .ThenBy(qr => qr.TimeElapsedSeconds)
                .ThenByDescending(qr => qr.CompletedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<QuizResult>> GetResultsByUserIdAsync(string userId, CancellationToken cancellationToken)
        {
            return await _context.QuizResults
                .Where(r => r.UserId == userId)
                .Include(r => r.Quiz)
                .ToListAsync(cancellationToken);
        }

        public async Task<QuizResult?> GetResultWithQuizAndAnswersAsync(string resultId, CancellationToken cancellationToken)
        {
            return await _context.QuizResults
                .Include(qr => qr.Quiz)
                    .ThenInclude(q => q.Questions)
                .Include(qr => qr.Answers)
                .FirstOrDefaultAsync(qr => qr.Id == resultId, cancellationToken);
        }
    }
}
