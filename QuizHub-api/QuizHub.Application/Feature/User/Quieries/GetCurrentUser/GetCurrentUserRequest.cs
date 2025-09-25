using MediatR;

namespace QuizHub.Application.Feature.User.Queries.GetCurrentUser
{
    public class GetCurrentUserRequest : IRequest<GetCurrentUserResponse>
    {
        public string Username { get; set; }
    }

    public class GetCurrentUserResponse
    {
        public bool Success { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string ProfilePicture { get; set; } // Base64 string
        public string ProfilePictureContentType { get; set; }
        public string Message { get; set; }
    }
}