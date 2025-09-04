using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;
using Backend.Exceptions;

namespace Backend.Services
{
    public class AISuggestionsService : IAISuggestionsService
    {
        private readonly IAISuggestionsRepository _repository;
        private readonly ILogger<AISuggestionsService> _logger;

        public AISuggestionsService(
            IAISuggestionsRepository repository,
            ILogger<AISuggestionsService> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        public async Task<AISuggestionCallbackResponseDto> ProcessCallbackAsync(AISuggestionCallbackDto dto)
        {
            _logger.LogInformation("Processing AISuggestion callback for ComplaintId: {ComplaintId}", dto.ComplaintId);
            
            try
            {
                // 1. Validate that the related ComplaintId exists
                _logger.LogDebug("Validating ComplaintId: {ComplaintId}", dto.ComplaintId);
                if (!await _repository.ComplaintExistsAsync(dto.ComplaintId))
                {
                    _logger.LogWarning("Complaint not found for ComplaintId: {ComplaintId}", dto.ComplaintId);
                    return new AISuggestionCallbackResponseDto
                    {
                        Success = false,
                        Message = "Complaint not found"
                    };
                }

                // Validate department if provided
                if (dto.SuggestedDeptId.HasValue)
                {
                    _logger.LogDebug("Validating SuggestedDeptId: {DepartmentId}", dto.SuggestedDeptId.Value);
                    var department = await _repository.GetDepartmentByIdAsync(dto.SuggestedDeptId.Value);
                    if (department == null)
                    {
                        _logger.LogWarning("Suggested department not found for DepartmentId: {DepartmentId}", dto.SuggestedDeptId.Value);
                        return new AISuggestionCallbackResponseDto
                        {
                            Success = false,
                            Message = "Suggested department not found"
                        };
                    }
                }

                // 2. Create AISuggestion object
                var aiSuggestion = new AISuggestion
                {
                    ComplaintId = dto.ComplaintId,
                    SuggestedDeptId = dto.SuggestedDeptId,
                    SuggestedCategory = dto.SuggestedCategory,
                    ConfidenceScore = dto.ConfidenceScore,
                    SuggestedAt = DateTime.UtcNow, // 3. Set SuggestedAt
                    N8nWorkflowId = dto.N8nWorkflowId
                };

                _logger.LogInformation("Creating AISuggestion for ComplaintId: {ComplaintId}, Category: {Category}, Confidence: {Confidence}", 
                    aiSuggestion.ComplaintId, aiSuggestion.SuggestedCategory, aiSuggestion.ConfidenceScore);

                // 4. Save to database
                var createdSuggestion = await _repository.CreateAsync(aiSuggestion);
                
                _logger.LogInformation("AISuggestion saved successfully with ID: {AISuggestionId} for ComplaintId: {ComplaintId}", 
                    createdSuggestion.AISuggestionId, createdSuggestion.ComplaintId);

                return new AISuggestionCallbackResponseDto
                {
                    Success = true,
                    Message = "AISuggestion saved",
                    Data = MapToResponseDto(createdSuggestion)
                };
            }
            catch (Exception ex)
            {
                // 5. Handle exceptions
                _logger.LogError(ex, "Failed to process AISuggestion callback for ComplaintId: {ComplaintId}", dto.ComplaintId);
                return new AISuggestionCallbackResponseDto
                {
                    Success = false,
                    Message = ex.Message
                };
            }
        }

        public async Task<AISuggestionResponseDto?> GetByIdAsync(int id)
        {
            var suggestion = await _repository.GetByIdAsync(id);
            return suggestion != null ? MapToResponseDto(suggestion) : null;
        }

        public async Task<AISuggestionResponseDto?> GetByComplaintIdAsync(int complaintId)
        {
            var suggestion = await _repository.GetByComplaintIdAsync(complaintId);
            return suggestion != null ? MapToResponseDto(suggestion) : null;
        }

        public async Task<IEnumerable<AISuggestionResponseDto>> GetAllAsync()
        {
            var suggestions = await _repository.GetAllAsync();
            return suggestions.Select(MapToResponseDto);
        }

        public async Task<AISuggestionResponseDto> CreateAsync(AISuggestionCreateDto dto)
        {
            // Validate complaint exists
            if (!await _repository.ComplaintExistsAsync(dto.ComplaintId))
                throw new NotFoundException("Complaint not found");

            // Validate department if provided
            if (dto.SuggestedDeptId.HasValue)
            {
                var department = await _repository.GetDepartmentByIdAsync(dto.SuggestedDeptId.Value);
                if (department == null)
                    throw new NotFoundException("Suggested department not found");
            }

            var aiSuggestion = new AISuggestion
            {
                ComplaintId = dto.ComplaintId,
                SuggestedDeptId = dto.SuggestedDeptId,
                SuggestedCategory = dto.SuggestedCategory,
                ConfidenceScore = dto.ConfidenceScore,
                SuggestedAt = DateTime.UtcNow,
                N8nWorkflowId = dto.N8nWorkflowId
            };

            var createdSuggestion = await _repository.CreateAsync(aiSuggestion);
            return MapToResponseDto(createdSuggestion);
        }

        private AISuggestionResponseDto MapToResponseDto(AISuggestion suggestion)
        {
            return new AISuggestionResponseDto
            {
                AISuggestionId = suggestion.AISuggestionId,
                ComplaintId = suggestion.ComplaintId,
                SuggestedDeptId = suggestion.SuggestedDeptId,
                DepartmentName = suggestion.SuggestedDept?.DepartmentName,
                SuggestedCategory = suggestion.SuggestedCategory,
                ConfidenceScore = suggestion.ConfidenceScore,
                SuggestedAt = suggestion.SuggestedAt,
                N8nWorkflowId = suggestion.N8nWorkflowId
            };
        }
    }
}
