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
            {

                throw new NotFoundException("ไม่พบเรื่องร้องเรียนนี้");
            }

            var department = await _repository.GetDepartmentByIdAsync(dto.DepartmentId);
            if (department == null)
            {

                throw new NotFoundException("ไม่พบหน่วยงานที่ระบุ");
            }



            // อัพเดตสถานะ
            complaint.CurrentStatus = ComplaintStatus.Forwarded;
            var updatedComplaint = await _repository.UpdateAsync(complaint);


            // สร้าง Assignment
            var assignment = new ComplaintAssignment
            {
                ComplaintId = complaintId,
                AssignedToDeptId = dto.DepartmentId,
                AssignedByUserId = userId ?? 1, // fallback เป็น admin หากไม่มี userId
                ForwardingNotes = dto.Notes,
                AssignedDate = DateTime.UtcNow,
                Status = ComplaintStatus.Forwarded,
                IsActive = true
            };



            try
            {
                await _repository.AddAssignmentAsync(assignment);

            }
            catch (Exception ex)
            {

                throw;
            }

            // สร้าง Log
            var log = new ComplaintLog
            {
                ComplaintId = complaintId,
                Timestamp = DateTime.UtcNow,
                Action = ComplaintAction.Forward,
                Notes = dto.Notes ?? "",
                UserId = userId, // ใช้ userId จาก JWT (อาจเป็น null ได้)
                DepartmentId = dto.DepartmentId,
                PreviousStatus = complaint.CurrentStatus,
                NewStatus = ComplaintStatus.Forwarded
            };



            try
            {
                await _repository.AddLogAsync(log);

            }
            catch (Exception ex)
            {

                throw;
            }

            // ส่ง webhook สำหรับการอัพเดต status
            // await _webhookService.SendComplaintUpdatedWebhookAsync(complaintId, "Forwarded");

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
                    Action = l.Action,
                    Notes = l.Notes ?? "",
                    UserId = l.UserId,
                    UserName = l.User?.Username,
                    DepartmentId = l.DepartmentId,
                    DepartmentName = l.Department?.DepartmentName,
                    PreviousStatus = l.PreviousStatus,
                    NewStatus = l.NewStatus
                }).ToList() ?? new List<ComplaintLogDto>(),
                Assignments = complaint.ComplaintAssignments?.Select(a => new ComplaintAssignmentDto
                {
                    AssignmentId = a.AssignmentId,
                    DepartmentId = a.AssignedToDeptId,
                    DepartmentName = a.AssignedToDept?.DepartmentName ?? "",
                    AssignedDate = a.AssignedDate,
                    Status = a.Status,
                    AssignedToUserId = a.AssignedToUserId,
                    AssignedToUserName = a.AssignedToUser?.Username,
                    ForwardingNotes = a.ForwardingNotes,
                    ProcessingNotes = a.ProcessingNotes,
                    ReceivedDate = a.ReceivedDate,
                    CompletedDate = a.CompletedDate,
                    ClosedDate = a.ClosedDate
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

        public async Task<ComplaintResponseDto> ReceiveComplaintAsync(ComplaintReceiveDto dto)
        {
            // ดึงข้อมูลเรื่องร้องเรียน
            var complaint = await _repository.GetByIdAsync(dto.ComplaintId);
            if (complaint == null)
                throw new NotFoundException("Complaint not found");

            // ดึง assignment ที่ active
            var assignment = await _repository.GetActiveAssignmentByComplaintIdAsync(dto.ComplaintId);
            if (assignment == null)
                throw new NotFoundException("No active assignment found");

            // อัพเดต assignment
            assignment.Status = ComplaintStatus.Received;
            assignment.ReceivedDate = DateTime.UtcNow;
            assignment.AssignedToUserId = dto.UserId;

            await _repository.UpdateAssignmentAsync(assignment);

            // อัพเดตสถานะเรื่องร้องเรียน
            complaint.CurrentStatus = ComplaintStatus.Received;
            await _repository.UpdateAsync(complaint);

            // บันทึก log
            await LogComplaintActionAsync(dto.ComplaintId, dto.UserId, ComplaintAction.Receive,
                dto.Notes, ComplaintStatus.Forwarded, ComplaintStatus.Received, assignment.AssignedToDeptId);

            return MapToComplaintResponseDto(complaint);
        }

        public async Task<ComplaintResponseDto> StartProgressAsync(ComplaintStartProgressDto dto)
        {
            var complaint = await _repository.GetByIdAsync(dto.ComplaintId);
            if (complaint == null)
                throw new NotFoundException("Complaint not found");

            var assignment = await _repository.GetActiveAssignmentByComplaintIdAsync(dto.ComplaintId);
            if (assignment == null)
                throw new NotFoundException("No active assignment found");

            // อัพเดต assignment
            assignment.Status = ComplaintStatus.InProgress;
            await _repository.UpdateAssignmentAsync(assignment);

            // อัพเดตสถานะเรื่องร้องเรียน
            complaint.CurrentStatus = ComplaintStatus.InProgress;
            await _repository.UpdateAsync(complaint);

            // บันทึก log
            await LogComplaintActionAsync(dto.ComplaintId, dto.UserId, ComplaintAction.StartProgress,
                dto.Notes, ComplaintStatus.Received, ComplaintStatus.InProgress, assignment.AssignedToDeptId);

            return MapToComplaintResponseDto(complaint);
        }

        public async Task<ComplaintResponseDto> CompleteComplaintAsync(ComplaintCompleteDto dto)
        {
            var complaint = await _repository.GetByIdAsync(dto.ComplaintId);
            if (complaint == null)
                throw new NotFoundException("Complaint not found");

            var assignment = await _repository.GetActiveAssignmentByComplaintIdAsync(dto.ComplaintId);
            if (assignment == null)
                throw new NotFoundException("No active assignment found");

            // อัพเดต assignment
            assignment.Status = ComplaintStatus.Completed;
            assignment.CompletedDate = DateTime.UtcNow;
            assignment.ProcessingNotes = dto.ProcessingNotes;
            await _repository.UpdateAssignmentAsync(assignment);

            // อัพเดตสถานะเรื่องร้องเรียน
            complaint.CurrentStatus = ComplaintStatus.Completed;
            await _repository.UpdateAsync(complaint);

            // บันทึก log
            await LogComplaintActionAsync(dto.ComplaintId, dto.UserId, ComplaintAction.Complete,
                dto.ProcessingNotes, ComplaintStatus.InProgress, ComplaintStatus.Completed, assignment.AssignedToDeptId);

            return MapToComplaintResponseDto(complaint);
        }

        public async Task<ComplaintResponseDto> CloseComplaintAsync(ComplaintCloseDto dto)
        {
            var complaint = await _repository.GetByIdAsync(dto.ComplaintId);
            if (complaint == null)
                throw new NotFoundException("Complaint not found");

            var assignment = await _repository.GetActiveAssignmentByComplaintIdAsync(dto.ComplaintId);
            if (assignment == null)
                throw new NotFoundException("No active assignment found");

            // อัพเดต assignment
            assignment.Status = ComplaintStatus.Closed;
            assignment.ClosedDate = DateTime.UtcNow;
            await _repository.UpdateAssignmentAsync(assignment);

            // อัพเดตสถานะเรื่องร้องเรียน
            complaint.CurrentStatus = ComplaintStatus.Closed;
            await _repository.UpdateAsync(complaint);

            // บันทึก log
            await LogComplaintActionAsync(dto.ComplaintId, dto.UserId, ComplaintAction.Close,
                dto.Notes, ComplaintStatus.Completed, ComplaintStatus.Closed, assignment.AssignedToDeptId);

            return MapToComplaintResponseDto(complaint);
        }

        public async Task<ComplaintResponseDto> RejectComplaintAsync(ComplaintRejectDto dto)
        {
            var complaint = await _repository.GetByIdAsync(dto.ComplaintId);
            if (complaint == null)
                throw new NotFoundException("Complaint not found");

            var assignment = await _repository.GetActiveAssignmentByComplaintIdAsync(dto.ComplaintId);
            if (assignment == null)
                throw new NotFoundException("No active assignment found");

            // อัพเดต assignment
            assignment.Status = ComplaintStatus.Rejected;
            assignment.IsActive = false;
            await _repository.UpdateAssignmentAsync(assignment);

            // อัพเดตสถานะเรื่องร้องเรียน
            complaint.CurrentStatus = ComplaintStatus.Rejected;
            await _repository.UpdateAsync(complaint);

            // บันทึก log
            await LogComplaintActionAsync(dto.ComplaintId, dto.UserId, ComplaintAction.Reject,
                dto.Reason, assignment.Status, ComplaintStatus.Rejected, assignment.AssignedToDeptId);

            return MapToComplaintResponseDto(complaint);
        }

        public async Task<ComplaintTrackingResponseDto?> GetComplaintTrackingAsync(int complaintId)
        {
            var complaint = await _repository.GetByIdAsync(complaintId);
            if (complaint == null)
                return null;

            var logs = await _repository.GetLogsByComplaintIdAsync(complaintId);
            var assignment = await _repository.GetActiveAssignmentByComplaintIdAsync(complaintId);

            return new ComplaintTrackingResponseDto
            {
                ComplaintId = complaint.ComplaintId,
                TicketId = complaint.TicketId.ToString(),
                Subject = complaint.Subject,
                CurrentStatus = complaint.CurrentStatus,
                Timeline = logs.Select(l => new ComplaintLogDto
                {
                    LogId = l.LogId,
                    Timestamp = l.Timestamp,
                    Action = l.Action,
                    Notes = l.Notes ?? "",
                    UserId = l.UserId,
                    UserName = l.User?.Username,
                    DepartmentId = l.DepartmentId,
                    DepartmentName = l.Department?.DepartmentName,
                    PreviousStatus = l.PreviousStatus,
                    NewStatus = l.NewStatus
                }).ToList(),
                CurrentAssignment = assignment != null ? new ComplaintAssignmentDto
                {
                    AssignmentId = assignment.AssignmentId,
                    DepartmentId = assignment.AssignedToDeptId,
                    DepartmentName = assignment.AssignedToDept?.DepartmentName ?? "",
                    AssignedDate = assignment.AssignedDate,
                    Status = assignment.Status,
                    AssignedToUserId = assignment.AssignedToUserId,
                    AssignedToUserName = assignment.AssignedToUser?.Username,
                    ForwardingNotes = assignment.ForwardingNotes,
                    ProcessingNotes = assignment.ProcessingNotes,
                    ReceivedDate = assignment.ReceivedDate,
                    CompletedDate = assignment.CompletedDate,
                    ClosedDate = assignment.ClosedDate
                } : null
            };
        }

        public async Task<ComplaintTrackingResponseDto?> GetComplaintTrackingByTicketIdAsync(string ticketId)
        {
            // แปลง string ticketId เป็น Guid
            if (!Guid.TryParse(ticketId, out Guid guid))
                return null;

            var complaint = await _repository.GetByTicketIdAsync(guid);
            if (complaint == null)
                return null;

            return await GetComplaintTrackingAsync(complaint.ComplaintId);
        }

        private async Task LogComplaintActionAsync(int complaintId, int userId, string action,
            string? notes, string? previousStatus, string? newStatus, int? departmentId = null)
        {
            var log = new ComplaintLog
            {
                ComplaintId = complaintId,
                UserId = userId,
                DepartmentId = departmentId,
                Action = action,
                Notes = notes,
                PreviousStatus = previousStatus,
                NewStatus = newStatus,
                Timestamp = DateTime.UtcNow
            };

            await _repository.AddLogAsync(log);
        }

        public async Task<IEnumerable<ComplaintResponseDto>> GetComplaintsByDepartmentAsync(int departmentId)
        {
            var complaints = await _repository.GetComplaintsByDepartmentAsync(departmentId);
            return complaints.Select(MapToComplaintResponseDto);
        }

        public async Task<IEnumerable<ComplaintResponseDto>> GetUserComplaintsAsync(int userId)
        {
            var complaints = await _repository.GetComplaintsByUserDepartmentAsync(userId);
            return complaints.Select(MapToComplaintResponseDto);
        }

        public async Task<List<object>> GetComplaintAssignmentsAsync(int complaintId)
        {
            return await _repository.GetComplaintAssignmentsAsync(complaintId);
        }

        public async Task<List<object>> GetComplaintLogsAsync(int complaintId)
        {
            return await _repository.GetComplaintLogsAsync(complaintId);
        }
    }
}
