using Backend.DTOs;

namespace Backend.Services
{
    public interface IDepartmentService
    {
        Task<IEnumerable<DepartmentDto>> GetAllDepartmentsAsync();
        Task<DepartmentDto?> GetDepartmentByIdAsync(int id);
        Task<DepartmentDto> CreateDepartmentAsync(DepartmentCreateDto dto);
        Task<DepartmentDto?> UpdateDepartmentAsync(int id, DepartmentUpdateDto dto);
        Task<bool> DeleteDepartmentAsync(int id);
    }
}
