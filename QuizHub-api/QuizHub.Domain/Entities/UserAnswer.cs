using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace QuizHub.Domain.Entities
{
    public class UserAnswer
    {
        public string Id { get; set; } = string.Empty;

        public string QuizResultId { get; set; } = string.Empty;
        public string QuestionId { get; set; } = string.Empty;

        public string AnswerJson { get; set; } = string.Empty;

        public bool IsCorrect { get; set; }

        [NotMapped]
        public object? Answer
        {
            get
            {
                try
                {
                    return JsonSerializer.Deserialize<object>(AnswerJson, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                }
                catch
                {
                    return null;
                }
            }
            set
            {
                AnswerJson = JsonSerializer.Serialize(value);
            }
        }
        public T? GetAnswerAs<T>()
        {
            try
            {
                return JsonSerializer.Deserialize<T>(AnswerJson);
            }
            catch
            {
                return default;
            }
        }
    }
}
