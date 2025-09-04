using Backend.DTOs;
using Backend.Repositories;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _repository;
        private readonly IConfiguration _configuration;
        private readonly string _passwordSalt;

        public AuthService(IAuthRepository repository, IConfiguration configuration)
        {
            _repository = repository;
            _configuration = configuration;
            _passwordSalt = Environment.GetEnvironmentVariable("PASSWORD_SALT") ?? "CMSKPRU2025";
        }

        public async Task<LoginResponseDto?> AuthenticateAsync(LoginRequestDto loginRequest)
        {
            var user = await _repository.GetUserByUsernameAsync(loginRequest.Username);
            if (user == null)
                return null;

            // Verify password
            var hashedPassword = PasswordHelper.HashPassword(loginRequest.Password, _passwordSalt);
            if (user.PasswordHash != hashedPassword)
                return null;

            // Update last login
            await _repository.UpdateLastLoginAsync(user.UserId);

            // Map to UserDto
            var userDto = new UserDto
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

            // Generate token
            var token = GenerateJwtToken(userDto);
            var expiresAt = DateTime.UtcNow.AddHours(8);

            return new LoginResponseDto
            {
                Token = token,
                User = userDto,
                ExpiresAt = expiresAt
            };
        }

        public string GenerateJwtToken(UserDto user)
        {
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "supersecretkey");
            var claims = new[]
            {
                new Claim("sub", user.Id.ToString()),
                new Claim("unique_name", user.Username),
                new Claim("role", user.Role),
                new Claim("email", user.Email),
                new Claim("fullName", user.FullName)
            };

            var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "localhost",
                audience: _configuration["Jwt:Audience"] ?? "localhost", 
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
