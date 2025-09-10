using Backend.DTOs;
using Backend.Services;
using Backend.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;
using System.Security.Claims;

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


                    dto = JsonSerializer.Deserialize<ComplaintCreateDto>(body, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    }) ?? new ComplaintCreateDto { Subject = "", Message = "" };


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


                // Debug: ดู claims ทั้งหมดใน JWT

                foreach (var claim in User.Claims)
                {

                }

                // ดึง UserId จาก JWT Token - ใช้ ClaimTypes.NameIdentifier แทน "sub"
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                int? userId = null;
                if (int.TryParse(userIdClaim, out int parsedUserId))
                {
                    userId = parsedUserId;
                }



                var result = await _complaintsService.ForwardComplaintAsync(id, dto, userId);

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

        /// <summary>
        /// เจ้าหน้าที่รับเรื่อง
        /// </summary>
        [HttpPost("{id}/receive")]
        public async Task<IActionResult> ReceiveComplaint(int id, [FromBody] ComplaintReceiveDto dto)
        {
            try
            {
                dto.ComplaintId = id;
                var result = await _complaintsService.ReceiveComplaintAsync(dto);
                return Ok(new
                {
                    message = "รับเรื่องเรียบร้อยแล้ว",
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

        /// <summary>
        /// เจ้าหน้าที่เริ่มดำเนินการ
        /// </summary>
        [HttpPost("{id}/start-progress")]
        public async Task<IActionResult> StartProgress(int id, [FromBody] ComplaintStartProgressDto dto)
        {
            try
            {
                dto.ComplaintId = id;
                var result = await _complaintsService.StartProgressAsync(dto);
                return Ok(new
                {
                    message = "เริ่มดำเนินการเรียบร้อยแล้ว",
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

        /// <summary>
        /// เจ้าหน้าที่ดำเนินการเสร็จ
        /// </summary>
        [HttpPost("{id}/complete")]
        public async Task<IActionResult> CompleteComplaint(int id, [FromBody] ComplaintCompleteDto dto)
        {
            try
            {
                dto.ComplaintId = id;
                var result = await _complaintsService.CompleteComplaintAsync(dto);
                return Ok(new
                {
                    message = "ดำเนินการเสร็จเรียบร้อยแล้ว",
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

        /// <summary>
        /// คณบดีอนุมัติปิดเรื่อง
        /// </summary>
        [HttpPost("{id}/close")]
        public async Task<IActionResult> CloseComplaint(int id, [FromBody] ComplaintCloseDto dto)
        {
            try
            {
                dto.ComplaintId = id;
                var result = await _complaintsService.CloseComplaintAsync(dto);
                return Ok(new
                {
                    message = "ปิดเรื่องเรียบร้อยแล้ว",
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

        /// <summary>
        /// ปฏิเสธเรื่อง
        /// </summary>
        [HttpPost("{id}/reject")]
        public async Task<IActionResult> RejectComplaint(int id, [FromBody] ComplaintRejectDto dto)
        {
            try
            {
                dto.ComplaintId = id;
                var result = await _complaintsService.RejectComplaintAsync(dto);
                return Ok(new
                {
                    message = "ปฏิเสธเรื่องเรียบร้อยแล้ว",
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

        /// <summary>
        /// ติดตามสถานะเรื่องร้องเรียน
        /// </summary>
        [HttpGet("{id}/tracking")]
        public async Task<IActionResult> GetComplaintTracking(int id)
        {
            try
            {
                var tracking = await _complaintsService.GetComplaintTrackingAsync(id);
                if (tracking == null)
                    return NotFound("ไม่พบเรื่องร้องเรียน");

                return Ok(tracking);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"เกิดข้อผิดพลาด: {ex.Message}");
            }
        }

        /// <summary>
        /// ดึงเรื่องร้องเรียนตาม Department ID
        /// </summary>
        [HttpGet("department/{departmentId}")]
        public async Task<IActionResult> GetComplaintsByDepartment(int departmentId)
        {
            try
            {
                var complaints = await _complaintsService.GetComplaintsByDepartmentAsync(departmentId);
                return Ok(complaints);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"เกิดข้อผิดพลาด: {ex.Message}");
            }
        }

        /// <summary>
        /// ดึงเรื่องร้องเรียนที่เกี่ยวข้องกับผู้ใช้ปัจจุบัน (ตาม department ของผู้ใช้)
        /// </summary>
        [HttpGet("user/complaints")]
        [Authorize]
        public async Task<IActionResult> GetUserComplaints()
        {
            try
            {
                // ดึง UserId จาก JWT Token
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized("ไม่พบข้อมูลผู้ใช้");
                }

                var complaints = await _complaintsService.GetUserComplaintsAsync(userId);
                return Ok(complaints);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"เกิดข้อผิดพลาด: {ex.Message}");
            }
        }

        /// <summary>
        /// ติดตามสถานะเรื่องร้องเรียนด้วย Ticket ID (สำหรับผู้ใช้ทั่วไป)
        /// </summary>
        [HttpGet("ticket/{ticketId}/tracking")]
        public async Task<IActionResult> GetComplaintTrackingByTicketId(string ticketId)
        {
            try
            {
                var tracking = await _complaintsService.GetComplaintTrackingByTicketIdAsync(ticketId);
                if (tracking == null)
                    return NotFound("ไม่พบเรื่องร้องเรียนด้วยหมายเลขนี้");

                return Ok(tracking);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"เกิดข้อผิดพลาด: {ex.Message}");
            }
        }

        /// <summary>
        /// Debug: ดู assignments ของเรื่องร้องเรียน
        /// </summary>
        [HttpGet("{id}/assignments")]
        public async Task<IActionResult> GetComplaintAssignments(int id)
        {
            try
            {
                var assignments = await _complaintsService.GetComplaintAssignmentsAsync(id);
                return Ok(assignments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"เกิดข้อผิดพลาด: {ex.Message}");
            }
        }

        /// <summary>
        /// Debug: ดู logs ของเรื่องร้องเรียน
        /// </summary>
        [HttpGet("{id}/logs")]
        public async Task<IActionResult> GetComplaintLogs(int id)
        {
            try
            {
                var logs = await _complaintsService.GetComplaintLogsAsync(id);
                return Ok(logs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"เกิดข้อผิดพลาด: {ex.Message}");
            }
        }
    }
}
