using MediatR;
using Microsoft.AspNetCore.Http;
using QuizHub.Application.Common.Mappings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.User.Commands.CreateUser
{
    public class CreateUserRequest : IRequest<CreateUserResponse>
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public IFormFile? ProfilePicture { get; set; }
    }
    public class CreateUserResponse : IMapFrom<Domain.Entities.User>
    {
        public string Message { get; set; } = string.Empty;
        public bool Success { get; set; } = false;
    }

}
