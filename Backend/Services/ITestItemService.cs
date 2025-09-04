using Backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public interface ITestItemService
    {
        Task<IEnumerable<TestItemDto>> GetAllAsync();
        Task<TestItemDto?> GetByIdAsync(int id);
        Task<TestItemDto> AddAsync(TestItemDto dto);
    }
}
