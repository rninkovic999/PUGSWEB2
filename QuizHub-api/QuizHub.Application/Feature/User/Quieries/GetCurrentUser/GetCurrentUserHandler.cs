using MediatR;
using QuizHub.Domain.Contracts;

namespace QuizHub.Application.Feature.User.Queries.GetCurrentUser
{
    public class GetCurrentUserHandler : IRequestHandler<GetCurrentUserRequest, GetCurrentUserResponse>
    {
        private readonly IUserRepository _userRepository;

        public GetCurrentUserHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<GetCurrentUserResponse> Handle(GetCurrentUserRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var user = await _userRepository.GetByUsernameAsync(request.Username, cancellationToken);

                if (user == null)
                {
                    return new GetCurrentUserResponse
                    {
                        Success = false,
                        Message = "User not found"
                    };
                }

                return new GetCurrentUserResponse
                {
                    Success = true,
                    Username = user.Username,
                    FullName = user.FullName,
                    Email = user.Email,
                    ProfilePicture = user.ProfilePicture != null ? Convert.ToBase64String(user.ProfilePicture) : null,
                    ProfilePictureContentType = user.ProfilePictureContentType,
                    Message = "User retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new GetCurrentUserResponse
                {
                    Success = false,
                    Message = $"Error retrieving user: {ex.Message}"
                };
            }
        }
    }
}