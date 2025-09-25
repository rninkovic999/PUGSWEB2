using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Common.Helpers
{
    public static class HashingService
    {
        public static (string salt, string hashedPassword) HashPassword(string password, string saltInput = null)
        {
            byte[] salt = saltInput is null
                ? RandomNumberGenerator.GetBytes(128 / 8)
                : Convert.FromBase64String(saltInput);

            Console.WriteLine($"Salt: {Convert.ToBase64String(salt)}");

            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password!,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));

            Console.WriteLine($"Hashed: {hashed}");

            return (Convert.ToBase64String(salt), hashed);
        }
    }
}
