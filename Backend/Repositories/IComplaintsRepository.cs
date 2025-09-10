using Backend.Models;
using Microsoft.AspNetCore.Http;

namespace Backend.Repositories
{
    public interface IComplaintsRepository
    {
        Task<Complaint> CreateAsync(Complaint complaint);
        Task<Complaint?> GetByIdAsync(int id);
        Task<Complaint?> GetByTicketIdAsync(Guid ticketId);
        Task<IEnumerable<Complaint>> GetAllAsync();
        Task<Complaint?> GetDetailByIdAsync(int id);
        Task<AISuggestion?> GetAISuggestionsByComplaintIdAsync(int complaintId);
        Task<Complaint> UpdateAsync(Complaint complaint);
        Task<ComplaintAssignment> AddAssignmentAsync(ComplaintAssignment assignment);
        Task<ComplaintLog> AddLogAsync(ComplaintLog log);
        Task<List<Attachment>> AddAttachmentsAsync(int complaintId, List<IFormFile> files, string uploadPath);
        Task<Department?> GetDepartmentByIdAsync(int departmentId);
        Task<User?> GetUserByIdAsync(int userId);
        Task<ComplaintAssignment?> GetActiveAssignmentByComplaintIdAsync(int complaintId);
        Task<ComplaintAssignment> UpdateAssignmentAsync(ComplaintAssignment assignment);
        Task<List<ComplaintLog>> GetLogsByComplaintIdAsync(int complaintId);
        Task<IEnumerable<Complaint>> GetComplaintsByDepartmentAsync(int departmentId);
        Task<IEnumerable<Complaint>> GetComplaintsByUserDepartmentAsync(int userId);

        // Debug methods
        Task<List<object>> GetComplaintAssignmentsAsync(int complaintId);
        Task<List<object>> GetComplaintLogsAsync(int complaintId);
    }
}
