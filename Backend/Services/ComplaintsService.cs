using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;
using Backend.Exceptions;
using Microsoft.AspNetCore.Http;

namespace Backend.Services
{
    public class ComplaintsService : IComplaintsService
    {
        private readonly IComplaintsRepository _repository;
        private readonly IWebhookService _webhookService;
        private readonly string _uploadPath;

        public ComplaintsService(
            IComplaintsRepository repository, 
            IWebhookService webhookService,
            IConfiguration configuration)
        {
            _repository = repository;
            _webhookService = webhookService;
            _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
        }

        public async Task<ComplaintResponseDto> CreateComplaintAsync(ComplaintCreateDto dto, List<IFormFile>? attachments = null)
        {
            try
            {
                var complaint = new Complaint
                {
                    ContactName = dto.IsAnonymous ? null : dto.ContactName,
                    ContactEmail = dto.IsAnonymous ? "" : (dto.ContactEmail ?? ""),
                    ContactPhone = dto.IsAnonymous ? null : dto.ContactPhone,
                    Subject = dto.Subject,
                    Message = dto.Message,
                    IsAnonymous = dto.IsAnonymous,
                    SubmissionDate = DateTime.UtcNow,
                    CurrentStatus = "Submitted",
                    TicketId = Guid.NewGuid(),
                    Attachments = new List<Attachment>()
                };

                var createdComplaint = await _repository.CreateAsync(complaint);

                // จัดการไฟล์แนบ
                if (attachments != null && attachments.Count > 0)
                {
                    var attachmentList = await _repository.AddAttachmentsAsync(
                        createdComplaint.ComplaintId, 
                        attachments, 
                        _uploadPath
                    );
                    createdComplaint.Attachments = attachmentList;
                }

                // ส่ง webhook ไป n8n (background job)
                await _webhookService.SendComplaintCreatedWebhookAsync(createdComplaint.ComplaintId);

                return MapToComplaintResponseDto(createdComplaint);
            }
            catch (Exception ex)
            {
                throw new Exception($"เกิดข้อผิดพลาดในการสร้างเรื่องร้องเรียน: {ex.Message}", ex);
            }
        }

        public async Task<ComplaintResponseDto?> GetComplaintByIdAsync(int id)
        {
            var complaint = await _repository.GetByIdAsync(id);
            return complaint != null ? MapToComplaintResponseDto(complaint) : null;
        }

        public async Task<IEnumerable<ComplaintResponseDto>> GetAllComplaintsAsync()
        {
            var complaints = await _repository.GetAllAsync();
            return complaints.Select(MapToComplaintResponseDto);
        }

        public async Task<ComplaintDetailDto?> GetComplaintDetailAsync(int id)
        {
            var complaint = await _repository.GetDetailByIdAsync(id);
            return complaint != null ? MapToComplaintDetailDto(complaint) : null;
        }

        public async Task<AISuggestionDto?> GetAISuggestionsAsync(int complaintId)
        {
            var suggestion = await _repository.GetAISuggestionsByComplaintIdAsync(complaintId);
            return suggestion != null ? MapToAISuggestionDto(suggestion) : null;
        }

        public async Task<ComplaintResponseDto> ForwardComplaintAsync(int complaintId, ForwardComplaintDto dto, int? userId = null)
        {
            var complaint = await _repository.GetByIdAsync(complaintId);
            if (complaint == null)
                throw new NotFoundException("ไม่พบเรื่องร้องเรียนนี้");

            var department = await _repository.GetDepartmentByIdAsync(dto.DepartmentId);
            if (department == null)
                throw new NotFoundException("ไม่พบหน่วยงานที่ระบุ");

            // อัพเดตสถานะ
            complaint.CurrentStatus = "Forwarded";
            var updatedComplaint = await _repository.UpdateAsync(complaint);

            // สร้าง Assignment
            var assignment = new ComplaintAssignment
            {
                ComplaintId = complaintId,
                AssignedToDeptId = dto.DepartmentId,
                AssignedDate = DateTime.UtcNow,
                Status = "Forwarded"
            };
            await _repository.AddAssignmentAsync(assignment);

            // สร้าง Log
            var log = new ComplaintLog
            {
                ComplaintId = complaintId,
                Timestamp = DateTime.UtcNow,
                LogType = "Forwarded",
                Details = dto.Notes ?? "",
                UserId = userId
            };
            await _repository.AddLogAsync(log);

            // ส่ง webhook สำหรับการอัพเดต status
            await _webhookService.SendComplaintUpdatedWebhookAsync(complaintId, "Forwarded");

            return MapToComplaintResponseDto(updatedComplaint);
        }

        private ComplaintResponseDto MapToComplaintResponseDto(Complaint complaint)
        {
            return new ComplaintResponseDto
            {
                ComplaintId = complaint.ComplaintId,
                ContactName = complaint.ContactName,
                ContactEmail = complaint.ContactEmail,
                ContactPhone = complaint.ContactPhone,
                Subject = complaint.Subject,
                Message = complaint.Message,
                IsAnonymous = complaint.IsAnonymous,
                SubmissionDate = complaint.SubmissionDate,
                CurrentStatus = complaint.CurrentStatus,
                TicketId = complaint.TicketId,
                Attachments = complaint.Attachments?.Select(a => new AttachmentDto
                {
                    AttachmentId = a.AttachmentId,
                    FileName = a.FileName,
                    FileUrl = a.FileUrl,
                    FileType = a.FileType,
                    UploadedAt = a.UploadedAt
                }).ToList() ?? new List<AttachmentDto>()
            };
        }

        private ComplaintDetailDto MapToComplaintDetailDto(Complaint complaint)
        {
            return new ComplaintDetailDto
            {
                ComplaintId = complaint.ComplaintId,
                ContactName = complaint.ContactName,
                ContactEmail = complaint.ContactEmail,
                ContactPhone = complaint.ContactPhone,
                Subject = complaint.Subject,
                Message = complaint.Message,
                IsAnonymous = complaint.IsAnonymous,
                SubmissionDate = complaint.SubmissionDate,
                CurrentStatus = complaint.CurrentStatus,
                TicketId = complaint.TicketId,
                Attachments = complaint.Attachments?.Select(a => new AttachmentDto
                {
                    AttachmentId = a.AttachmentId,
                    FileName = a.FileName,
                    FileUrl = a.FileUrl,
                    FileType = a.FileType,
                    UploadedAt = a.UploadedAt
                }).ToList() ?? new List<AttachmentDto>(),
                ComplaintLogs = complaint.ComplaintLogs?.Select(l => new ComplaintLogDto
                {
                    LogId = l.LogId,
                    Timestamp = l.Timestamp,
                    LogType = l.LogType,
                    Details = l.Details ?? "",
                    UserId = l.UserId
                }).ToList() ?? new List<ComplaintLogDto>(),
                Assignments = complaint.ComplaintAssignments?.Select(a => new ComplaintAssignmentDto
                {
                    AssignmentId = a.AssignmentId,
                    DepartmentId = a.AssignedToDeptId ?? 0,
                    DepartmentName = a.AssignedToDept?.DepartmentName ?? "",
                    AssignedDate = a.AssignedDate,
                    Status = a.Status
                }).ToList() ?? new List<ComplaintAssignmentDto>()
            };
        }

        private AISuggestionDto MapToAISuggestionDto(AISuggestion suggestion)
        {
            return new AISuggestionDto
            {
                SuggestionId = suggestion.AISuggestionId,
                ComplaintId = suggestion.ComplaintId,
                SuggestionText = suggestion.SuggestedCategory ?? "",
                ConfidenceScore = (double)(suggestion.ConfidenceScore ?? 0f),
                GeneratedAt = suggestion.SuggestedAt
            };
        }
    }
}
