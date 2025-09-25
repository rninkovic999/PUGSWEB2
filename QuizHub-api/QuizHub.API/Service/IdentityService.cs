using QuizHub.Application.Contracts;

namespace QuizHub.API.Service
{
    public class IdentityService : IIdentityService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public IdentityService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string Username => _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        public string UserIdentity => _httpContextAccessor.HttpContext?.User.FindFirst("sub")?.Value;
    }
}
