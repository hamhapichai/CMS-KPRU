using Backend.DTOs;
using Microsoft.AspNetCore.Http;

namespace Backend.Services
{
    public interface IComplaintsService
    {
        Task<ComplaintResponseDto> CreateComplaintAsync(ComplaintCreateDto dto, List<IFormFile>? attachments = null);
        Task<ComplaintResponseDto?> GetComplaintByIdAsync(int id);
        Task<IEnumerable<ComplaintResponseDto>> GetAllComplaintsAsync();
        Task<ComplaintDetailDto?> GetComplaintDetailAsync(int id);
        Task<AISuggestionDto?> GetAISuggestionsAsync(int complaintId);
        Task<ComplaintResponseDto> ForwardComplaintAsync(int complaintId, ForwardComplaintDto dto, int? userId = null);

        // Workflow methods
        Task<ComplaintResponseDto> ReceiveComplaintAsync(ComplaintReceiveDto dto);
        Task<ComplaintResponseDto> StartProgressAsync(ComplaintStartProgressDto dto);
        Task<ComplaintResponseDto> CompleteComplaintAsync(ComplaintCompleteDto dto);
        Task<ComplaintResponseDto> CloseComplaintAsync(ComplaintCloseDto dto);
        Task<ComplaintResponseDto> RejectComplaintAsync(ComplaintRejectDto dto);
        Task<ComplaintTrackingResponseDto?> GetComplaintTrackingAsync(int complaintId);
        Task<ComplaintTrackingResponseDto?> GetComplaintTrackingByTicketIdAsync(string ticketId);
        Task<IEnumerable<ComplaintResponseDto>> GetComplaintsByDepartmentAsync(int departmentId);
        Task<IEnumerable<ComplaintResponseDto>> GetUserComplaintsAsync(int userId);

        // Debug methods
        Task<List<object>> GetComplaintAssignmentsAsync(int complaintId);
        Task<List<object>> GetComplaintLogsAsync(int complaintId);
    }
}
