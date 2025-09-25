using MediatR;
using QuizHub.Application.Common.Mappings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.User.Quieries.GetUserForGlobalLeaderboard
{
    public class GetUserForGlobalLeaderboardQueryRequest : IRequest<GetUserForGlobalLeaderboardQueryResponse>
    {
    }

    public class GetUserForGlobalLeaderboardQueryResponse
    {
        public List<UserLeaderboardDto> Users { get; set; } = new();
        public string Message { get; set; } = string.Empty;
        public bool Success { get; set; } = false;
    }
    public class UserLeaderboardDto : IMapFrom<Domain.Entities.User>
    {
        public string Username { get; set; } = string.Empty;
        public byte[]? ProfilePicture { get; set; }
        public string ProfilePictureContentType { get; set; } = string.Empty;
        public int GlobalScore { get; set; }
    }

}
