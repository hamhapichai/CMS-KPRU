using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = "officer";
        public string Department { get; set; } = string.Empty;
        public DateTime? LastLoginAt { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateUserDto
    {
        [Required(ErrorMessage = "Username is required")]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Role is required")]
        public string Role { get; set; } = "officer";
        
        public string? Department { get; set; }
    }

    public class UpdateUserDto
    {
        [MaxLength(100)]
        public string? FullName { get; set; }
        
        [EmailAddress]
        [MaxLength(100)]
        public string? Email { get; set; }
        
        public string? Role { get; set; }
        public string? Department { get; set; }
        public bool? IsActive { get; set; }
    }

    public class ResetPasswordDto
    {
        [Required(ErrorMessage = "New password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string NewPassword { get; set; } = string.Empty;
    }

    public class UserSearchDto
    {
        public string? Search { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class UserListResponseDto
    {
        public int Total { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public List<UserDto> Users { get; set; } = new List<UserDto>();
    }
}
