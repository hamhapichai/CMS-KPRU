using Backend.DTOs;
using Backend.Services;
using Backend.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AISuggestionsController : ControllerBase
    {
        private readonly IAISuggestionsService _aiSuggestionsService;
        private readonly ILogger<AISuggestionsController> _logger;

        public AISuggestionsController(
            IAISuggestionsService aiSuggestionsService,
            ILogger<AISuggestionsController> logger)
        {
            _aiSuggestionsService = aiSuggestionsService;
            _logger = logger;
        }

        /// <summary>
        /// Callback endpoint for AI suggestions from external services (like n8n)
        /// </summary>
        [HttpPost("callback")]
        public async Task<IActionResult> Callback([FromBody] AISuggestionCallbackDto dto)
        {
            _logger.LogInformation("Received AISuggestion callback request for ComplaintId: {ComplaintId}", dto?.ComplaintId);
            
            try
            {
                if (dto == null)
                {
                    _logger.LogWarning("AISuggestion callback received null dto");
                    return BadRequest(new { success = false, message = "Request body is required" });
                }
                
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Invalid model state for AISuggestion callback: {@ModelState}", ModelState);
                    return BadRequest(new 
                    { 
                        success = false, 
                        message = "Invalid request data",
                        errors = ModelState
                    });
                }

                var result = await _aiSuggestionsService.ProcessCallbackAsync(dto);
                
                if (!result.Success)
                {
                    _logger.LogWarning("AISuggestion callback failed: {Message}", result.Message);
                    
                    if (result.Message == "Complaint not found")
                        return NotFound(new { success = false, message = result.Message });
                    
                    return BadRequest(new { success = false, message = result.Message });
                }

                _logger.LogInformation("AISuggestion callback processed successfully for ComplaintId: {ComplaintId}", dto.ComplaintId);
                return Ok(new { success = true, message = result.Message, data = result.Data });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in AISuggestion callback for ComplaintId: {ComplaintId}", dto?.ComplaintId);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get all AI suggestions
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var suggestions = await _aiSuggestionsService.GetAllAsync();
                return Ok(suggestions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"เกิดข้อผิดพลาด: {ex.Message}" });
            }
        }

        /// <summary>
        /// Get AI suggestion by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var suggestion = await _aiSuggestionsService.GetByIdAsync(id);
                if (suggestion == null)
                    return NotFound(new { message = "ไม่พบคำแนะนำจาก AI นี้" });

                return Ok(suggestion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"เกิดข้อผิดพลาด: {ex.Message}" });
            }
        }

        /// <summary>
        /// Get AI suggestion by ComplaintId
        /// </summary>
        [HttpGet("complaint/{complaintId}")]
        public async Task<IActionResult> GetByComplaintId(int complaintId)
        {
            try
            {
                var suggestion = await _aiSuggestionsService.GetByComplaintIdAsync(complaintId);
                if (suggestion == null)
                    return NotFound(new { message = "ไม่พบคำแนะนำจาก AI สำหรับเรื่องร้องเรียนนี้" });

                return Ok(suggestion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"เกิดข้อผิดพลาด: {ex.Message}" });
            }
        }

        /// <summary>
        /// Create new AI suggestion manually
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AISuggestionCreateDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var suggestion = await _aiSuggestionsService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = suggestion.AISuggestionId }, suggestion);
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"เกิดข้อผิดพลาด: {ex.Message}" });
            }
        }
    }
}
