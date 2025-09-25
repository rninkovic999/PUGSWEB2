using QuizHub.Domain.Contracts;
using QuizHub.Domain.Entities;
using QuizHub.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace QuizHub.Infrastructure.Repository
{
    public class UserAnswerRepository : IUserAnswerRepository
    {
        private readonly AppDbContext _context;
        public UserAnswerRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }
        public async Task<bool> AddAsync(UserAnswer userAnswer, CancellationToken cancellationToken)
        {
            await _context.UserAnswers.AddAsync(userAnswer, cancellationToken);
            return await _context.SaveChangesAsync(cancellationToken) > 0;
        }
    }
}
