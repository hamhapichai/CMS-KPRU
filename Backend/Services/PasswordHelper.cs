using System.Security.Cryptography;
using System.Text;

namespace Backend.Services
{
    public static class PasswordHelper
    {
        public static string HashPassword(string password, string salt)
        {
            using (var sha256 = SHA256.Create())
            {
                var saltedPassword = salt + password;
                var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
                // Convert hash to hex string (lowercase, no separator)
                var sb = new StringBuilder();
                foreach (var b in hash)
                {
                    sb.Append(b.ToString("x2"));
                }
                return sb.ToString();
            }
        }
    }
}
