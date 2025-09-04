using Backend.Models;
using Microsoft.AspNetCore.Http;

namespace Backend.Repositories
{
    public interface IComplaintsRepository
    {
        Task<Complaint> CreateAsync(Complaint complaint);
        Task<Complaint?> GetByIdAsync(int id);
        Task<IEnumerable<Complaint>> GetAllAsync();
        Task<Complaint?> GetDetailByIdAsync(int id);
        Task<AISuggestion?> GetAISuggestionsByComplaintIdAsync(int complaintId);
        Task<Complaint> UpdateAsync(Complaint complaint);
        Task<ComplaintAssignment> AddAssignmentAsync(ComplaintAssignment assignment);
        Task<ComplaintLog> AddLogAsync(ComplaintLog log);
        Task<List<Attachment>> AddAttachmentsAsync(int complaintId, List<IFormFile> files, string uploadPath);
        Task<Department?> GetDepartmentByIdAsync(int departmentId);
    }
}
