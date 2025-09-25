using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Entities
{
    public class User
    {
        public string Id { get; set; } = String.Empty;
        public string Username { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;
        public string FullName { get; set; } = String.Empty;
        public string PasswordHash { get; set; } = String.Empty;
        public string PasswordSalt { get; set; } = String.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
        public int GlobalScore { get; set; } = 0;
        public bool isAdmin { get; set; } = false;
        public byte []? ProfilePicture { get; set; }
        public string? ProfilePictureContentType { get; set; }
    }
}
