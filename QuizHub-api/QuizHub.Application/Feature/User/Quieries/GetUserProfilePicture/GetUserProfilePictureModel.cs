using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.User.Quieries.GetUserProfilePicture
{
    public class GetUserProfilePictureRequest : IRequest<GetUserProfilePictureResponse>
    {
        public string Username { get; set; } = string.Empty;
    }
    public class GetUserProfilePictureResponse
    {
        public byte[]? ProfilePicture { get; set; } = null;
        public string ProfilePictureContentType { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool Success { get; set; } = false;
    }
}
