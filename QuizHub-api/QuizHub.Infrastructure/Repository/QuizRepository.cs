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
    public class QuizRepository : IQuizRepository
    {
        private readonly AppDbContext _context;
        public QuizRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }
        public async Task<bool> CreateQuizAsync(Quiz quiz, CancellationToken cancellationToken)
        {
            await _context.Quizzes.AddAsync(quiz, cancellationToken);
            return await _context.SaveChangesAsync(cancellationToken) > 0;
        }

        public async Task<bool> DeleteQuizAsync(string quizId, CancellationToken cancellationToken)
        {

            var quiz = await _context.Quizzes.FindAsync(new object[] { quizId }, cancellationToken);
            if (quiz == null)
            {
                return false;
            }
            _context.Quizzes.Remove(quiz);
            return await _context.SaveChangesAsync(cancellationToken) > 0;
        }

        public async Task<IEnumerable<Quiz>> GetAllQuizzesByCreatedByIdAsync(string createdById, CancellationToken cancellationToken)
        {            
            return await _context.Quizzes
                .Where(q => q.CreatedByUserId == createdById)
                .Include(q => q.Questions)
                .ToListAsync(cancellationToken);
        }
        public async Task<IEnumerable<Quiz>> GetAllQuizzesAsync(CancellationToken cancellationToken)
        {            
            return await _context.Quizzes
                .Include(q => q.Questions)
                .ToListAsync(cancellationToken);
        }

        public async Task<Quiz?> GetQuizByIdAsync(string quizId, CancellationToken cancellationToken)
        {          
            return await _context.Quizzes
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.Id == quizId, cancellationToken);
        }

        public async Task<bool> UpdateQuizAsync(Quiz quiz, CancellationToken cancellationToken)
        {
            _context.Quizzes.Update(quiz);
            return await _context.SaveChangesAsync(cancellationToken) > 0;
        }

        public async Task<List<string>> GetAllCategoriesAsync(CancellationToken cancellationToken)
        {            
            return await _context.Quizzes
                .Select(q => q.Category)
                .Distinct()
                .ToListAsync(cancellationToken);
        }
        public async Task<IEnumerable<Quiz>> GetAllQuizzesFilteredAsync(string? keyword, string? category, int? difficulty, CancellationToken cancellationToken)
        {
            var query = _context.Quizzes.Include(q => q.Questions).AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var lowerKeyword = keyword.ToLower();
                query = query.Where(q =>
                    q.Title.ToLower().Contains(lowerKeyword) ||
                    (q.Description != null && q.Description.ToLower().Contains(lowerKeyword))
                );
            }

            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(q => q.Category == category);
            }

            if (difficulty.HasValue)
            {
                query = query.Where(q => q.Difficulty == difficulty.Value);
            }

            return await query.ToListAsync(cancellationToken);
        }

        public async Task<Quiz?> GetQuizByTitleAsync(string title, CancellationToken cancellationToken)
        {
            return await _context.Quizzes
                .FirstOrDefaultAsync(q => q.Title == title, cancellationToken);
        }
    }
}
