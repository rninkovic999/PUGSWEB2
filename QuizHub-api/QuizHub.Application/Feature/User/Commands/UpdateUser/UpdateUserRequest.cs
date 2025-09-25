using MediatR;
using Microsoft.AspNetCore.Http;

namespace QuizHub.Application.Feature.User.Commands.UpdateUser
{
    public class UpdateUserRequest : IRequest<UpdateUserResponse>
    {
        public string Username { get; set; } // Setuje se iz Controller-a
        public string FullName { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; } // Opciono
        public IFormFile? ProfilePicture { get; set; } // Opciono
    }

    public class UpdateUserResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }
}