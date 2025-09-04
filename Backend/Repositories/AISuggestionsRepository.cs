using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class AISuggestionsRepository : IAISuggestionsRepository
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AISuggestionsRepository> _logger;

        public AISuggestionsRepository(AppDbContext context, ILogger<AISuggestionsRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<AISuggestion> CreateAsync(AISuggestion aiSuggestion)
        {
            _logger.LogInformation("Creating AISuggestion for ComplaintId: {ComplaintId}", aiSuggestion.ComplaintId);
            
            try
            {
                _context.AISuggestions.Add(aiSuggestion);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("AISuggestion created successfully with ID: {AISuggestionId}", aiSuggestion.AISuggestionId);
                
                // Reload with includes to get related data
                var result = await GetByIdAsync(aiSuggestion.AISuggestionId);
                return result ?? aiSuggestion;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create AISuggestion for ComplaintId: {ComplaintId}", aiSuggestion.ComplaintId);
                throw;
            }
        }

        public async Task<AISuggestion?> GetByIdAsync(int id)
        {
            return await _context.AISuggestions
                .Include(a => a.Complaint)
                .Include(a => a.SuggestedDept)
                .FirstOrDefaultAsync(a => a.AISuggestionId == id);
        }

        public async Task<AISuggestion?> GetByComplaintIdAsync(int complaintId)
        {
            return await _context.AISuggestions
                .Include(a => a.Complaint)
                .Include(a => a.SuggestedDept)
                .FirstOrDefaultAsync(a => a.ComplaintId == complaintId);
        }

        public async Task<IEnumerable<AISuggestion>> GetAllAsync()
        {
            return await _context.AISuggestions
                .Include(a => a.Complaint)
                .Include(a => a.SuggestedDept)
                .OrderByDescending(a => a.SuggestedAt)
                .ToListAsync();
        }

        public async Task<bool> ComplaintExistsAsync(int complaintId)
        {
            _logger.LogDebug("Checking if complaint exists for ComplaintId: {ComplaintId}", complaintId);
            
            var exists = await _context.Complaints.AnyAsync(c => c.ComplaintId == complaintId);
            
            _logger.LogDebug("Complaint exists check result for ComplaintId {ComplaintId}: {Exists}", complaintId, exists);
            
            return exists;
        }

        public async Task<Department?> GetDepartmentByIdAsync(int departmentId)
        {
            return await _context.Departments
                .FirstOrDefaultAsync(d => d.DepartmentId == departmentId && !d.IsDeleted);
        }
    }
}
