using MediatR;
using QuizHub.Application.Common.Exceptions;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.User.Quieries.GetUserProfilePicture
{
    public class GetUserProfilePictureHandler : IRequestHandler<GetUserProfilePictureRequest, GetUserProfilePictureResponse>
    {
        private readonly IUserRepository _userRepository;
        public GetUserProfilePictureHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task<GetUserProfilePictureResponse> Handle(GetUserProfilePictureRequest request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByUsernameAsync(request.Username, cancellationToken);

            if (user is null)
            {
                throw new NotFoundException("User", request.Username);
            }

            return new GetUserProfilePictureResponse
            {
                ProfilePicture = user.ProfilePicture,
                ProfilePictureContentType = user.ProfilePictureContentType ?? "application/octet-stream",
                Message = user.ProfilePicture != null ? "Profile picture retrieved successfully." : "User does not have a profile picture.",
                Success = true
            };
        }
    }
}
