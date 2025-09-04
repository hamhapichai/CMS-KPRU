using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _repository;

        public RoleService(IRoleRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<RoleDto>> GetAllRolesAsync()
        {
            var roles = await _repository.GetAllAsync();
            return roles.Select(MapToRoleDto);
        }

        public async Task<RoleDto?> GetRoleByIdAsync(int id)
        {
            var role = await _repository.GetByIdAsync(id);
            return role != null ? MapToRoleDto(role) : null;
        }

        public async Task<RoleDto> CreateRoleAsync(RoleCreateDto dto)
        {
            // Check if role already exists
            var existingRole = await _repository.GetByNameAsync(dto.RoleName);
            if (existingRole != null)
                throw new ArgumentException("Role already exists");

            var role = new Role
            {
                RoleName = dto.RoleName
            };

            var createdRole = await _repository.CreateAsync(role);
            return MapToRoleDto(createdRole);
        }

        private RoleDto MapToRoleDto(Role role)
        {
            return new RoleDto
            {
                RoleId = role.RoleId,
                RoleName = role.RoleName
            };
        }
    }
}
