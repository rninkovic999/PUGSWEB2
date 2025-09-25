using MediatR;
using QuizHub.Application.Common.Helpers;
using QuizHub.Domain.Contracts;

namespace QuizHub.Application.Feature.User.Commands.UpdateUser
{
    public class UpdateUserHandler : IRequestHandler<UpdateUserRequest, UpdateUserResponse>
    {
        private readonly IUserRepository _userRepository;

        public UpdateUserHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UpdateUserResponse> Handle(UpdateUserRequest request, CancellationToken cancellationToken)
        {
            try
            {
                // Pronađi postojećeg korisnika
                var user = await _userRepository.GetByUsernameAsync(request.Username, cancellationToken);

                if (user == null)
                {
                    return new UpdateUserResponse
                    {
                        Success = false,
                        Message = "User not found"
                    };
                }

                // Ažuriraj osnovne podatke
                user.FullName = request.FullName;
                user.Email = request.Email;

                // Ažuriraj password samo ako je dat
                if (!string.IsNullOrEmpty(request.Password))
                {
                    var (salt, hashPassword) = HashingService.HashPassword(request.Password);
                    user.PasswordHash = hashPassword;
                    user.PasswordSalt = salt;
                }

                // Ažuriraj profilnu sliku samo ako je data
                if (request.ProfilePicture != null && request.ProfilePicture.Length > 0)
                {
                    using (var ms = new MemoryStream())
                    {
                        await request.ProfilePicture.CopyToAsync(ms, cancellationToken);
                        user.ProfilePicture = ms.ToArray();
                        user.ProfilePictureContentType = request.ProfilePicture.ContentType;
                    }
                }

                // Sačuvaj promene
                var result = await _userRepository.UpdateAsync(user, cancellationToken);

                if (result)
                {
                    return new UpdateUserResponse
                    {
                        Success = true,
                        Message = "Nalog je uspešno ažuriran!"
                    };
                }
                else
                {
                    return new UpdateUserResponse
                    {
                        Success = false,
                        Message = "Failed to update user"
                    };
                }
            }
            catch (Exception ex)
            {
                return new UpdateUserResponse
                {
                    Success = false,
                    Message = $"Error updating user: {ex.Message}"
                };
            }
        }
    }
}