using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class TestItemService : ITestItemService
    {
        private readonly ITestItemRepository _repo;
        public TestItemService(ITestItemRepository repo)
        {
            _repo = repo;
        }
        public async Task<IEnumerable<TestItemDto>> GetAllAsync()
        {
            var items = await _repo.GetAllAsync();
            return items.Select(x => new TestItemDto { Id = x.Id, Name = x.Name });
        }
        public async Task<TestItemDto?> GetByIdAsync(int id)
        {
            var item = await _repo.GetByIdAsync(id);
            if (item == null) return null;
            return new TestItemDto { Id = item.Id, Name = item.Name };
        }
        public async Task<TestItemDto> AddAsync(TestItemDto dto)
        {
            var item = new TestItem { Name = dto.Name };
            var result = await _repo.AddAsync(item);
            return new TestItemDto { Id = result.Id, Name = result.Name };
        }
    }
}
