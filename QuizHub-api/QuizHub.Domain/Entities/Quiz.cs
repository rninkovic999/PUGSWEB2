using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Entities
{
    public class Quiz
    {
        public string Id { get; set; } = String.Empty;
        public string Title { get; set; } = String.Empty;
        public string Category { get; set; } = String.Empty;
        public string? Description { get; set; }
        public int TimeLimitSeconds { get; set; }
        public int Difficulty { get; set; }
        public string CreatedByUserId { get; set; } = String.Empty;
        public List<Question> Questions { get; set; } = new();
        public List<QuizResult> Results { get; set; } = new();
    }
}
