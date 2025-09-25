using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Contracts
{
    public interface IUserRepository
    {
        Task<bool> AddAsync(User user, CancellationToken cancellationToken);
        Task<bool> UpdateAsync(User user, CancellationToken cancellationToken);
        Task<User?> GetByIdAsync(string userId, CancellationToken cancellationToken);
        Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken);
        Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken);
        Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken);
        Task<User?> GetByEmailOrUsernameAsync(string email, string username, CancellationToken cancellationToken);
        Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken);
        Task<bool> UsernameExistsAsync(string username, CancellationToken cancellationToken);
        Task<bool> IsValidUserAsync(string username, string passwordHash, CancellationToken cancellationToken);
        Task<byte[]?> GetProfilePictureByIdAsync(string userId, CancellationToken cancellationToken);
    }
}
