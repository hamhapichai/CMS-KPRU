using Backend.Models;

namespace Backend.Repositories
{
    public interface IDepartmentRepository
    {
        Task<IEnumerable<Department>> GetAllAsync();
        Task<Department?> GetByIdAsync(int id);
        Task<Department> CreateAsync(Department department);
        Task<Department> UpdateAsync(Department department);
        Task<bool> SoftDeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
