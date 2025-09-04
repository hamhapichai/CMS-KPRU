using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly AppDbContext _context;

        public DepartmentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Department>> GetAllAsync()
        {
            return await _context.Departments
                .Where(d => !d.IsDeleted)
                .OrderBy(d => d.DepartmentName)
                .ToListAsync();
        }

        public async Task<Department?> GetByIdAsync(int id)
        {
            return await _context.Departments
                .Where(d => d.DepartmentId == id && !d.IsDeleted)
                .FirstOrDefaultAsync();
        }

        public async Task<Department> CreateAsync(Department department)
        {
            _context.Departments.Add(department);
            await _context.SaveChangesAsync();
            return department;
        }

        public async Task<Department> UpdateAsync(Department department)
        {
            _context.Departments.Update(department);
            await _context.SaveChangesAsync();
            return department;
        }

        public async Task<bool> SoftDeleteAsync(int id)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null || department.IsDeleted)
                return false;

            department.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Departments
                .AnyAsync(d => d.DepartmentId == id && !d.IsDeleted);
        }
    }
}
