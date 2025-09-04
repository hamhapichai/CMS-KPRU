using Backend.Models;

namespace Backend.Repositories
{
    public interface IAISuggestionsRepository
    {
        Task<AISuggestion> CreateAsync(AISuggestion aiSuggestion);
        Task<AISuggestion?> GetByIdAsync(int id);
        Task<AISuggestion?> GetByComplaintIdAsync(int complaintId);
        Task<IEnumerable<AISuggestion>> GetAllAsync();
        Task<bool> ComplaintExistsAsync(int complaintId);
        Task<Department?> GetDepartmentByIdAsync(int departmentId);
    }
}
