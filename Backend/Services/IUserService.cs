using Backend.DTOs;

namespace Backend.Services
{
    public interface IUserService
    {
        Task<UserListResponseDto> GetAllUsersAsync(UserSearchDto searchDto);
        Task<UserDto?> GetUserByIdAsync(int id);
        Task<UserDto> CreateUserAsync(CreateUserDto dto);
        Task<UserDto?> UpdateUserAsync(int id, UpdateUserDto dto);
        Task<bool> SetUserActiveAsync(int id, bool isActive);
        Task<bool> ResetUserPasswordAsync(int id, ResetPasswordDto dto);
        Task<bool> UserExistsAsync(int id);
        Task<bool> UsernameExistsAsync(string username);
    }
}
