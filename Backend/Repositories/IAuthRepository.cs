using Backend.Models;

namespace Backend.Repositories
{
    public interface IAuthRepository
    {
        Task<User?> GetUserByUsernameAsync(string username);
        Task<bool> UpdateLastLoginAsync(int userId);
    }
}
