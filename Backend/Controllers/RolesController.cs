using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RolesController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var roles = await _roleService.GetAllRolesAsync();
                return Ok(roles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"เกิดข้อผิดพลาด: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var role = await _roleService.GetRoleByIdAsync(id);
                if (role == null)
                    return NotFound("ไม่พบบทบาทนี้");

                return Ok(role);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"เกิดข้อผิดพลาด: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] RoleCreateDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var role = await _roleService.CreateRoleAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = role.RoleId }, role);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"เกิดข้อผิดพลาด: {ex.Message}");
            }
        }
    }
}
