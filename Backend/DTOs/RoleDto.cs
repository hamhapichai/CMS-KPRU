using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class RoleDto
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty;
    }

    public class RoleCreateDto
    {
        [Required(ErrorMessage = "Role name is required")]
        [MaxLength(50)]
        public string RoleName { get; set; } = string.Empty;
    }
}
