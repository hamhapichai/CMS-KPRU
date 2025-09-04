using Backend.DTOs;
using Backend.Services;
using Backend.Exceptions;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComplaintsController : ControllerBase
    {
        private readonly IComplaintsService _complaintsService;

        public ComplaintsController(IComplaintsService complaintsService)
        {
            _complaintsService = complaintsService;
        }

        [HttpPost]
        public async Task<IActionResult> Create()
        {
            try
            {
                ComplaintCreateDto dto;
                List<IFormFile>? attachments = null;

                // ตรวจสอบว่าเป็น FormData หรือ JSON
                if (Request.HasFormContentType)
                {
                    // FormData
                    dto = new ComplaintCreateDto
                    {
                        ContactName = Request.Form["contactName"].ToString(),
                        ContactEmail = Request.Form["contactEmail"].ToString(),
                        ContactPhone = Request.Form["contactPhone"].ToString(),
                        Subject = Request.Form["subject"].ToString() ?? "",
                        Message = Request.Form["message"].ToString() ?? "",
                        IsAnonymous = bool.Parse(Request.Form["isAnonymous"].FirstOrDefault() ?? "false")
                    };

                    if (Request.Form.Files.Count > 0)
                    {
                        attachments = Request.Form.Files.Where(f => f.Name == "attachments").ToList();
                    }
                }
                else
                {
                    // JSON
                    using var reader = new StreamReader(Request.Body);
                    var body = await reader.ReadToEndAsync();
                    Console.WriteLine($"Received JSON body: {body}"); // Debug log

                    dto = JsonSerializer.Deserialize<ComplaintCreateDto>(body, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    }) ?? new ComplaintCreateDto { Subject = "", Message = "" };

                    Console.WriteLine($"Parsed DTO: Subject={dto.Subject}, Message={dto.Message}, ContactName={dto.ContactName}"); // Debug log
                }

                var result = await _complaintsService.CreateComplaintAsync(dto, attachments);

                return Ok(new
                {
                    success = true,
                    message = "ส่งเรื่องร้องเรียนสำเร็จ",
                    ticketId = result.TicketId,
                    data = result
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}"); // Debug log
                return BadRequest(new
                {
                    success = false,
                    message = "เกิดข้อผิดพลาดในการส่งเรื่องร้องเรียน: " + ex.Message
                });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var complaints = await _complaintsService.GetAllComplaintsAsync();
                return Ok(complaints);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"เกิดข้อผิดพลาด: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var complaint = await _complaintsService.GetComplaintDetailAsync(id);
                
                if (complaint == null)
                    return NotFound("ไม่พบเรื่องร้องเรียนนี้");

                return Ok(complaint);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"เกิดข้อผิดพลาด: {ex.Message}");
            }
        }

        [HttpGet("{id}/Suggestions")]
        public async Task<IActionResult> GetAISuggestionsbyComplaintId(int id)
        {
            try
            {
                var suggestions = await _complaintsService.GetAISuggestionsAsync(id);
                
                if (suggestions == null)
                    return NotFound("ไม่พบคำแนะนำจาก AI สำหรับเรื่องร้องเรียนนี้");

                return Ok(suggestions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"เกิดข้อผิดพลาด: {ex.Message}");
            }
        }

        [HttpPost("{id}/forward")]
        public async Task<IActionResult> ForwardComplaint(int id, [FromBody] ForwardComplaintDto dto)
        {
            try
            {
                // TODO: ดึง UserId จาก JWT Token
                var result = await _complaintsService.ForwardComplaintAsync(id, dto);

                return Ok(new
                {
                    message = "ส่งต่อเรื่องเรียบร้อยแล้ว",
                    data = result
                });
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"เกิดข้อผิดพลาด: {ex.Message}");
            }
        }
    }
}
