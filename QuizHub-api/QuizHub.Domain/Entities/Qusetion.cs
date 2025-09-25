using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Entities
{
    public abstract class Question
    {
        public string Id { get; set; } = string.Empty;
        public string QuizId { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public abstract string Type { get; }
        public abstract bool IsCorrect(object userAnswer);
    }

    public class SingleChoiceQuestion : Question
    {
        public List<string> Options { get; set; } = new();
        public int CorrectOptionIndex { get; set; }

        public override string Type => "SingleChoice";

        public override bool IsCorrect(object userAnswer)
        {
            return userAnswer is int index && index == CorrectOptionIndex;
        }
    }
    public class MultipleChoiceQuestion : Question
    {
        public List<string> Options { get; set; } = new();
        public List<int> CorrectOptionIndices { get; set; } = new();

        public override string Type => "MultipleChoice";

        public override bool IsCorrect(object userAnswer)
        {
            if (userAnswer is List<int> userIndices)
            {
                return !CorrectOptionIndices.Except(userIndices).Any() &&
                       !userIndices.Except(CorrectOptionIndices).Any();
            }
            return false;
        }
    }
    public class TrueFalseQuestion : Question
    {
        public bool CorrectAnswer { get; set; }

        public override string Type => "TrueFalse";

        public override bool IsCorrect(object userAnswer)
        {
            return userAnswer is bool b && b == CorrectAnswer;
        }
    }
    public class FillInTheBlankQuestion : Question
    {
        public string CorrectAnswer { get; set; } = string.Empty;

        public override string Type => "FillInTheBlank";

        public override bool IsCorrect(object userAnswer)
        {
            return userAnswer is string s && s.Trim().Equals(CorrectAnswer.Trim(), StringComparison.OrdinalIgnoreCase);
        }
    }
}
