using AutoMapper;
using MediatR;
using QuizHub.Application.Common.Mappings;
using QuizHub.Application.Feature.Quiz.Queries.GetQuizWithQuestionsById;
using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Quiz.Queries.GetQuizWithQuestionsAndAnswersById
{
    public class GetQuizWithQuestionsAndAnswersByIdQueryRequest : IRequest<GetQuizWithQuestionsAndAnswersByIdQueryResponse>
    {
        public GetQuizWithQuestionsAndAnswersByIdQueryRequest(string quizId, string username)
        {
            QuizId = quizId;
            Username = username;
        }
        public string QuizId { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
    }

    public class QuestionAnswerDto : IMapFrom<Domain.Entities.Question>
    {
        public string Id { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public List<string>? Options { get; set; } = new List<string>();
        public int? CorrectOptionIndex { get; set; }
        public List<int>? CorrectOptionIndices { get; set; }
        public bool? CorrectAnswerBool { get; set; }
        public string? CorrectAnswerText { get; set; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<Domain.Entities.Question, QuestionAnswerDto>()
                .Include<SingleChoiceQuestion, QuestionAnswerDto>()
                .Include<MultipleChoiceQuestion, QuestionAnswerDto>()
                .Include<TrueFalseQuestion, QuestionAnswerDto>()
                .Include<FillInTheBlankQuestion, QuestionAnswerDto>()
                .AfterMap((src, dest) =>
                {
                    switch (src)
                    {
                        case SingleChoiceQuestion single:
                            dest.Options = single.Options;
                            dest.CorrectOptionIndex = single.CorrectOptionIndex;
                            break;

                        case MultipleChoiceQuestion multi:
                            dest.Options = multi.Options;
                            dest.CorrectOptionIndices = multi.CorrectOptionIndices;
                            break;

                        case TrueFalseQuestion tf:
                            dest.CorrectAnswerBool = tf.CorrectAnswer;
                            break;

                        case FillInTheBlankQuestion fib:
                            dest.CorrectAnswerText = fib.CorrectAnswer;
                            break;
                    }
                });


            profile.CreateMap<SingleChoiceQuestion, QuestionAnswerDto>();
            profile.CreateMap<MultipleChoiceQuestion, QuestionAnswerDto>();
            profile.CreateMap<TrueFalseQuestion, QuestionAnswerDto>();
            profile.CreateMap<FillInTheBlankQuestion, QuestionAnswerDto>();
        }
    }

    public class GetQuizWithQuestionsAndAnswersByIdQueryResponse : IMapFrom<Domain.Entities.Quiz>
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = string.Empty;
        public int TimeLimitSeconds { get; set; }
        public int Difficulty { get; set; }
        public List<QuestionAnswerDto> Questions { get; set; } = new List<QuestionAnswerDto>();
    }
}
