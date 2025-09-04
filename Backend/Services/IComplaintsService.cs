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
    }
}
