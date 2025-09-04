using Backend.Models;
using Backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(IEnumerable<User> Users, int Total)> GetAllAsync(UserSearchDto searchDto)
        {
            var query = _context.Users
                .Include(u => u.Role)
                .Include(u => u.Department)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchDto.Search))
            {
                query = query.Where(u => 
                    u.Username.Contains(searchDto.Search) || 
                    u.Email.Contains(searchDto.Search) || 
                    u.FullName.Contains(searchDto.Search));
            }

            var total = await query.CountAsync();
            var users = await query
                .OrderBy(u => u.UserId)
                .Skip((searchDto.Page - 1) * searchDto.PageSize)
                .Take(searchDto.PageSize)
                .ToListAsync();

            return (users, total);
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users
                .Include(u => u.Role)
                .Include(u => u.Department)
                .FirstOrDefaultAsync(u => u.UserId == id);
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _context.Users
                .Include(u => u.Role)
                .Include(u => u.Department)
                .FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<User> CreateAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            
            // Reload with includes
            return await GetByIdAsync(user.UserId) ?? user;
        }

        public async Task<User> UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> SetActiveAsync(int id, bool isActive)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return false;

            user.IsActive = isActive;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ResetPasswordAsync(int id, string passwordHash)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return false;

            user.PasswordHash = passwordHash;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Users.AnyAsync(u => u.UserId == id);
        }

        public async Task<bool> UsernameExistsAsync(string username)
        {
            return await _context.Users.AnyAsync(u => u.Username == username);
        }

        public async Task<Role?> GetRoleByNameAsync(string roleName)
        {
            return await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == roleName);
        }

        public async Task<Department?> GetDepartmentByNameAsync(string departmentName)
        {
            return await _context.Departments.FirstOrDefaultAsync(d => d.DepartmentName == departmentName);
        }
    }
}
