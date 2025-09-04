using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class DepartmentDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class DepartmentCreateDto
    {
        [Required(ErrorMessage = "Department name is required")]
        [MaxLength(100)]
        public string DepartmentName { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Description { get; set; }
    }

    public class DepartmentUpdateDto
    {
        [Required(ErrorMessage = "Department name is required")]
        [MaxLength(100)]
        public string DepartmentName { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Description { get; set; }
    }
}
