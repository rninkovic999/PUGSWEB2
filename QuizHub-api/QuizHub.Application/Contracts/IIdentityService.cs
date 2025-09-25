using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Contracts
{
    public interface IIdentityService
    {
        public string? Username { get; }
        public string? UserIdentity { get; }
    }
}
