using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Settings
{
    public class TokenServiceProviderSettings
    {
        public const string TokenServiceProvider = "TokenServiceProvider";

        public string Issuer { get; set; } = String.Empty;
        public string Audience { get; set; } = String.Empty;
        public string Secret { get; set; } = String.Empty;
    }
}
