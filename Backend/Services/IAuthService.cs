using Backend.DTOs;

namespace Backend.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDto?> AuthenticateAsync(LoginRequestDto loginRequest);
        string GenerateJwtToken(UserDto user);
    }
}
