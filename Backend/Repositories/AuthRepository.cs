using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly AppDbContext _context;

        public AuthRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
                .Include(u => u.Role)
                .Include(u => u.Department)
                .FirstOrDefaultAsync(u => u.Username == username && u.IsActive);
        }

        public async Task<bool> UpdateLastLoginAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return false;

            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
