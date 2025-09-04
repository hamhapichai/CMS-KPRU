using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;
using Backend.Exceptions;
using Backend.Services;

namespace Backend.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;
        private readonly string _passwordSalt;

        public UserService(IUserRepository repository, IConfiguration configuration)
        {
            _repository = repository;
            _passwordSalt = Environment.GetEnvironmentVariable("PASSWORD_SALT") ?? "CMSKPRU2025";
        }

        public async Task<UserListResponseDto> GetAllUsersAsync(UserSearchDto searchDto)
        {
            var (users, total) = await _repository.GetAllAsync(searchDto);
            
            return new UserListResponseDto
            {
                Total = total,
                Page = searchDto.Page,
                PageSize = searchDto.PageSize,
                Users = users.Select(MapToUserDto).ToList()
            };
        }

        public async Task<UserDto?> GetUserByIdAsync(int id)
        {
            var user = await _repository.GetByIdAsync(id);
            return user != null ? MapToUserDto(user) : null;
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto dto)
        {
            // Check if username already exists
            if (await _repository.UsernameExistsAsync(dto.Username))
                throw new ArgumentException("Username already exists");

            // Get role
            var role = await _repository.GetRoleByNameAsync(dto.Role);
            if (role == null)
                throw new ArgumentException("Invalid role");

            // Get department if specified
            Department? department = null;
            if (!string.IsNullOrWhiteSpace(dto.Department))
            {
                department = await _repository.GetDepartmentByNameAsync(dto.Department);
                if (department == null)
                    throw new ArgumentException("Invalid department");
            }

            // Hash password
            var passwordHash = PasswordHelper.HashPassword(dto.Password, _passwordSalt);

            var user = new User
            {
                Username = dto.Username,
                PasswordHash = passwordHash,
                FullName = dto.FullName,
                Email = dto.Email,
                RoleId = role.RoleId,
                Role = role,
                Department = department,
                IsActive = true
            };

            var createdUser = await _repository.CreateAsync(user);
            return MapToUserDto(createdUser);
        }

        public async Task<UserDto?> UpdateUserAsync(int id, UpdateUserDto dto)
        {
            var user = await _repository.GetByIdAsync(id);
            if (user == null)
                throw new NotFoundException("User not found");

            // Update fields if provided
            if (!string.IsNullOrWhiteSpace(dto.FullName))
                user.FullName = dto.FullName;

            if (!string.IsNullOrWhiteSpace(dto.Email))
                user.Email = dto.Email;

            if (!string.IsNullOrWhiteSpace(dto.Role))
            {
                var role = await _repository.GetRoleByNameAsync(dto.Role);
                if (role == null)
                    throw new ArgumentException("Invalid role");
                user.RoleId = role.RoleId;
                user.Role = role;
            }

            if (!string.IsNullOrWhiteSpace(dto.Department))
            {
                var department = await _repository.GetDepartmentByNameAsync(dto.Department);
                if (department == null)
                    throw new ArgumentException("Invalid department");
                user.Department = department;
            }

            if (dto.IsActive.HasValue)
                user.IsActive = dto.IsActive.Value;

            var updatedUser = await _repository.UpdateAsync(user);
            return MapToUserDto(updatedUser);
        }

        public async Task<bool> SetUserActiveAsync(int id, bool isActive)
        {
            if (!await _repository.ExistsAsync(id))
                throw new NotFoundException("User not found");

            return await _repository.SetActiveAsync(id, isActive);
        }

        public async Task<bool> ResetUserPasswordAsync(int id, ResetPasswordDto dto)
        {
            if (!await _repository.ExistsAsync(id))
                throw new NotFoundException("User not found");

            var passwordHash = PasswordHelper.HashPassword(dto.NewPassword, _passwordSalt);
            return await _repository.ResetPasswordAsync(id, passwordHash);
        }

        public async Task<bool> UserExistsAsync(int id)
        {
            return await _repository.ExistsAsync(id);
        }

        public async Task<bool> UsernameExistsAsync(string username)
        {
            return await _repository.UsernameExistsAsync(username);
        }

        private UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.UserId,
                Username = user.Username,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role?.RoleName ?? "officer",
                Department = user.Department?.DepartmentName ?? "",
                LastLoginAt = user.LastLoginAt,
                IsActive = user.IsActive
            };
        }
    }
}
