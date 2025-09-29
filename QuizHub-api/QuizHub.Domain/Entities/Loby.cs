using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Entities
{
    public class Loby
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = string.Empty;
        public string CreatorId { get; set; } = string.Empty;
        public int TimePreQuestionLimitSeconds { get; set; }
        public string QuizTile { get; set; } = string.Empty;
        public string QuizId { get; set; } = string.Empty;
        public Quiz? Quiz { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime StartAt { get; set; }
        public List<User> Participants { get; set; } = new List<User>();
        public bool IsActive { get; set; }

        public Dictionary<string, int> Scores { get; set; } = new(); // username -> score
        public Dictionary<Guid, List<string>> CorrectAnswers { get; set; } = new(); // questionId -> list of usernames koji su tačno odgovorili
    }
}
