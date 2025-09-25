using MediatR;
using QuizHub.Domain.Contracts;
using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Question.Commands.CreateQuestion
{
    public class CreateQuestionCommandHandler : IRequestHandler<CreateQuestionCommandRequest, CreateQuestionCommandResponse>
    {
        private readonly IQuestionRepository _questionRepository;
        public CreateQuestionCommandHandler(IQuestionRepository questionRepository)
        {
            _questionRepository = questionRepository ?? throw new ArgumentNullException(nameof(questionRepository));
        }
        public async Task<CreateQuestionCommandResponse> Handle(CreateQuestionCommandRequest request, CancellationToken cancellationToken)
        {
            Domain.Entities.Question question;

            switch (request.Type)
            {
                case "SingleChoice":
                    question = new SingleChoiceQuestion
                    {
                        QuizId = request.QuizId,
                        Text = request.Text,
                        Options = request.Options ?? new(),
                        CorrectOptionIndex = request.CorrectOptionIndex ?? 0
                    };
                    break;

                case "MultipleChoice":
                    question = new MultipleChoiceQuestion
                    {
                        QuizId = request.QuizId,
                        Text = request.Text,
                        Options = request.Options ?? new(),
                        CorrectOptionIndices = request.CorrectOptionIndices ?? new()
                    };
                    break;

                case "TrueFalse":
                    question = new TrueFalseQuestion
                    {
                        QuizId = request.QuizId,
                        Text = request.Text,
                        CorrectAnswer = request.CorrectAnswerBool ?? false
                    };
                    break;

                case "FillInTheBlank":
                    question = new FillInTheBlankQuestion
                    {
                        QuizId = request.QuizId,
                        Text = request.Text,
                        CorrectAnswer = request.CorrectAnswerText ?? ""
                    };
                    break;

                default:
                    throw new ArgumentException($"Unsupported question type: {request.Type}");
            }

            question.Id = Guid.NewGuid().ToString();

            var result = await _questionRepository.CreateQuestionAsync(question, cancellationToken);

            if (result)
            {
                return new CreateQuestionCommandResponse
                {
                    Success = true,
                    Message = "Question created successfully.",
                    QuestionId = question.Id
                };
            }

            throw new Exception("Failed to create question. Try again later.");
        }
    }
}
