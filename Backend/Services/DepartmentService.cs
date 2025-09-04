using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;
using Backend.Exceptions;

namespace Backend.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IDepartmentRepository _repository;

        public DepartmentService(IDepartmentRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<DepartmentDto>> GetAllDepartmentsAsync()
        {
            var departments = await _repository.GetAllAsync();
            return departments.Select(MapToDepartmentDto);
        }

        public async Task<DepartmentDto?> GetDepartmentByIdAsync(int id)
        {
            var department = await _repository.GetByIdAsync(id);
            return department != null ? MapToDepartmentDto(department) : null;
        }

        public async Task<DepartmentDto> CreateDepartmentAsync(DepartmentCreateDto dto)
        {
            var department = new Department
            {
                DepartmentName = dto.DepartmentName,
                Description = dto.Description,
                IsDeleted = false
            };

            var createdDepartment = await _repository.CreateAsync(department);
            return MapToDepartmentDto(createdDepartment);
        }

        public async Task<DepartmentDto?> UpdateDepartmentAsync(int id, DepartmentUpdateDto dto)
        {
            var department = await _repository.GetByIdAsync(id);
            if (department == null)
                throw new NotFoundException("Department not found");

            department.DepartmentName = dto.DepartmentName;
            department.Description = dto.Description;

            var updatedDepartment = await _repository.UpdateAsync(department);
            return MapToDepartmentDto(updatedDepartment);
        }

        public async Task<bool> DeleteDepartmentAsync(int id)
        {
            var exists = await _repository.ExistsAsync(id);
            if (!exists)
                throw new NotFoundException("Department not found");

            return await _repository.SoftDeleteAsync(id);
        }

        private DepartmentDto MapToDepartmentDto(Department department)
        {
            return new DepartmentDto
            {
                Id = department.DepartmentId,
                Name = department.DepartmentName,
                Description = department.Description
            };
        }
    }
}
