using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class TestItemRepository : ITestItemRepository
    {
        private readonly AppDbContext _context;
        public TestItemRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<TestItem>> GetAllAsync()
        {
            return await _context.TestItems.ToListAsync();
        }
        public async Task<TestItem?> GetByIdAsync(int id)
        {
            return await _context.TestItems.FindAsync(id);
        }
        public async Task<TestItem> AddAsync(TestItem item)
        {
            _context.TestItems.Add(item);
            await _context.SaveChangesAsync();
            return item;
        }
    }
}
