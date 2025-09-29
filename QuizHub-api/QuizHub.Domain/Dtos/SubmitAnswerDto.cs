using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Dtos
{
    public class SubmitAnswerDto
    {
        public string LobbyId { get; set; } = string.Empty;
        public string QuestionId { get; set; } = string.Empty;
        public object Answer { get; set; } = default!;
    }
}
