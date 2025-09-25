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
    public class QuestionRepository : IQuestionRepository
    {
        private readonly AppDbContext _context;
        public QuestionRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }
        public async Task<bool> CreateQuestionAsync(Question question, CancellationToken cancellationToken)
        {      
            await _context.Questions.AddAsync(question, cancellationToken);
            return await _context.SaveChangesAsync(cancellationToken) > 0;
        }

        public async Task<bool> DeleteQuestionAsync(string questionId, CancellationToken cancellationToken)
        {     
            var question = await _context.Questions.FindAsync(new object[] { questionId }, cancellationToken);
            if (question == null)
            {
                return false;
            }
            _context.Questions.Remove(question);
            return await _context.SaveChangesAsync(cancellationToken) > 0;
        }

        public async Task<Question?> GetQuestionByIdAsync(string questionId, CancellationToken cancellationToken)
        {
            return await _context.Questions
                .FirstOrDefaultAsync(q => q.Id == questionId, cancellationToken);
        }

        public async Task<IEnumerable<Question>> GetQuestionsByQuizIdAsync(string quizId, CancellationToken cancellationToken)
        {            
            return await _context.Questions
                .Where(q => q.QuizId == quizId)
                .ToListAsync(cancellationToken);
        }

        public async Task<bool> UpdateQuestionAsync(Question question, CancellationToken cancellationToken)
        {           
            _context.Questions.Update(question);
            return await _context.SaveChangesAsync(cancellationToken) > 0;
        }
    }
}
