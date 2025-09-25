using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Entities
{
    public class QuizResult
    {
        public string Id { get; set; } = string.Empty;

        public string UserId { get; set; } = string.Empty;
        public string QuizId { get; set; } = string.Empty;
        public Quiz Quiz { get; set; }

        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public double Score { get; set; }
        public int TimeElapsedSeconds { get; set; }

        public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
        public List<UserAnswer> Answers { get; set; } = new();
    }
}
