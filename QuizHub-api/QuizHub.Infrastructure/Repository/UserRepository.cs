using Microsoft.EntityFrameworkCore;
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
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;
        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AddAsync(User user, CancellationToken cancellationToken)
        {
            await _context.Users.AddAsync(user, cancellationToken);
            return await _context.SaveChangesAsync(cancellationToken) > 0;
        }

        public async Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken)
        {
            return await _context.Users.AnyAsync(u => u.Email == email, cancellationToken);
        }

        public async Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.Users
                .OrderByDescending(u => u.GlobalScore)
                .Take(10)
                .ToListAsync(cancellationToken);
        }

        public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken)
        {           
            return await _context.Users
                .Where(u => u.Email == email)
                .FirstOrDefaultAsync(cancellationToken);
        }

        public async Task<User?> GetByEmailOrUsernameAsync(string email, string username, CancellationToken cancellationToken)
        {            
            return await _context.Users
                .Where(u => u.Email == email || u.Username == username)
                .FirstOrDefaultAsync(cancellationToken);
        }

        public async Task<User?> GetByIdAsync(string userId, CancellationToken cancellationToken)
        {
            return await _context.Users
                .Where(u => u.Id == userId)
                .FirstOrDefaultAsync(cancellationToken);
        }

        public async Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken)
        {
            
            return await _context.Users
                .Where(u => u.Username == username)
                .FirstOrDefaultAsync(cancellationToken);
        }

        public async Task<byte[]?> GetProfilePictureByIdAsync(string userId, CancellationToken cancellationToken)
        {        
            return await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => u.ProfilePicture)
                .FirstOrDefaultAsync(cancellationToken);
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
                .Where(u => u.Username == username)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> IsValidUserAsync(string username, string passwordHash, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateAsync(User user, CancellationToken cancellationToken)
        {      
            _context.Users.Update(user);
            return await _context.SaveChangesAsync(cancellationToken) > 0;
        }

        public async Task<bool> UsernameExistsAsync(string username, CancellationToken cancellationToken)
        {
            return await _context.Users.AnyAsync(u => u.Username == username, cancellationToken);
        }
    }
}
