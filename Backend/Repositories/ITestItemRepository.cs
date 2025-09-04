using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public interface ITestItemRepository
    {
        Task<IEnumerable<TestItem>> GetAllAsync();
        Task<TestItem?> GetByIdAsync(int id);
        Task<TestItem> AddAsync(TestItem item);
    }
}
