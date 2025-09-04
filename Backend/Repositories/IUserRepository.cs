using Backend.Models;
using Backend.DTOs;

namespace Backend.Repositories
{
    public interface IUserRepository
    {
        Task<(IEnumerable<User> Users, int Total)> GetAllAsync(UserSearchDto searchDto);
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByUsernameAsync(string username);
        Task<User> CreateAsync(User user);
        Task<User> UpdateAsync(User user);
        Task<bool> SetActiveAsync(int id, bool isActive);
        Task<bool> ResetPasswordAsync(int id, string passwordHash);
        Task<bool> ExistsAsync(int id);
        Task<bool> UsernameExistsAsync(string username);
        Task<Role?> GetRoleByNameAsync(string roleName);
        Task<Department?> GetDepartmentByNameAsync(string departmentName);
    }
}
