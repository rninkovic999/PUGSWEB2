using AutoMapper;
using MediatR;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.User.Quieries.GetUserForGlobalLeaderboard
{
    public class GetUserForGlobalLeaderboardQueryHandler : IRequestHandler<GetUserForGlobalLeaderboardQueryRequest, GetUserForGlobalLeaderboardQueryResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public GetUserForGlobalLeaderboardQueryHandler(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<GetUserForGlobalLeaderboardQueryResponse> Handle(GetUserForGlobalLeaderboardQueryRequest request, CancellationToken cancellationToken)
        {
            var users = await _userRepository.GetAllAsync(cancellationToken);

            var userDtos = _mapper.Map<List<UserLeaderboardDto>>(users);

            return new GetUserForGlobalLeaderboardQueryResponse
            {
                Users = userDtos,
                Message = "Success",
                Success = true
            };
        }
    }
}
