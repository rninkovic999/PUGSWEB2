using AutoMapper;
using MediatR;
using QuizHub.Application.Common.Mappings;
using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Quiz.Queries.GetQuizWithQuestionsById
{
    public class GetQuizWithQuestionsByIdQueryRequest : IRequest<GetQuizWithQuestionsByIdQueryResponse>
    {
        public GetQuizWithQuestionsByIdQueryRequest(string quizId)
        {
            QuizId = quizId;
        }
        public string QuizId { get; set; } = string.Empty;
    }
    public class QuestionDto : IMapFrom<Domain.Entities.Question>
    {
        public string Id { get; set; } = string.Empty;
        public string QuizId { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public List<string>? Options { get; set; } = new List<string>();
        public void Mapping(Profile profile)
        {
            profile.CreateMap<Domain.Entities.Question, QuestionDto>()
                .Include<SingleChoiceQuestion, QuestionDto>()
                .Include<MultipleChoiceQuestion, QuestionDto>()
                .Include<TrueFalseQuestion, QuestionDto>()
                .Include<FillInTheBlankQuestion, QuestionDto>()
                .ForMember(dest => dest.Options, opt => opt.Ignore())
                .AfterMap((src, dest) =>
                {
                    if (src is SingleChoiceQuestion single)
                        dest.Options = single.Options;
                    else if (src is MultipleChoiceQuestion multi)
                        dest.Options = multi.Options;
                    else
                        dest.Options = null;
                });

            profile.CreateMap<SingleChoiceQuestion, QuestionDto>();
            profile.CreateMap<MultipleChoiceQuestion, QuestionDto>();
            profile.CreateMap<TrueFalseQuestion, QuestionDto>();
            profile.CreateMap<FillInTheBlankQuestion, QuestionDto>();
        }
    }
    public class GetQuizWithQuestionsByIdQueryResponse : IMapFrom<Domain.Entities.Quiz>
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = string.Empty;
        public int TimeLimitSeconds { get; set; }
        public int Difficulty { get; set; }
        public List<QuestionDto> Questions { get; set; } = new List<QuestionDto>();
    }
}
