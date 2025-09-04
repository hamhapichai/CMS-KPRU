using Backend.DTOs;

namespace Backend.Services
{
    public interface IAISuggestionsService
    {
        Task<AISuggestionCallbackResponseDto> ProcessCallbackAsync(AISuggestionCallbackDto dto);
        Task<AISuggestionResponseDto?> GetByIdAsync(int id);
        Task<AISuggestionResponseDto?> GetByComplaintIdAsync(int complaintId);
        Task<IEnumerable<AISuggestionResponseDto>> GetAllAsync();
        Task<AISuggestionResponseDto> CreateAsync(AISuggestionCreateDto dto);
    }
}
