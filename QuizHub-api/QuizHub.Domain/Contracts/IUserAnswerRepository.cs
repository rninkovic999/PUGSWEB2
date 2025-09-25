using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Contracts
{
    public interface IUserAnswerRepository
    {
        Task<bool> AddAsync(UserAnswer userAnswer, CancellationToken cancellationToken);
    }
}
