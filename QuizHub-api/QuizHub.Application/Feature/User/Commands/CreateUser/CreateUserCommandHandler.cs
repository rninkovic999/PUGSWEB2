using AutoMapper;
using MediatR;
using QuizHub.Application.Common.Helpers;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.User.Commands.CreateUser
{
    public class CreateUserCommandHandler : IRequestHandler<CreateUserRequest, CreateUserResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public CreateUserCommandHandler(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }
        public async Task<CreateUserResponse> Handle(CreateUserRequest request, CancellationToken cancellationToken)
        {

            var (salt, hashPassword) = HashingService.HashPassword(request.Password);

            byte[]? imageBytes = null;
            if (request.ProfilePicture != null && request.ProfilePicture.Length > 0)
            {
                using (var ms = new MemoryStream())
                {
                    await request.ProfilePicture.CopyToAsync(ms, cancellationToken);
                    imageBytes = ms.ToArray();
                }
            }

            var ret = await _userRepository.AddAsync(new Domain.Entities.User
            {
                Id = Guid.NewGuid().ToString(),
                Username = request.Username,
                Email = request.Email,
                PasswordHash = hashPassword,
                PasswordSalt = salt,
                FullName = request.FullName,
                ProfilePicture = imageBytes,
                ProfilePictureContentType = request.ProfilePicture?.ContentType
            }, cancellationToken);

            if(ret)
            {
                return new CreateUserResponse
                {
                    Message = "User created successfully.",
                    Success = true
                };
            }

            throw new Exception("Failed to create quiz. Please try again later.");
        }
    }
}
