using Backend.Configuration;
using Microsoft.Extensions.Options;

namespace Backend.Services
{
    public interface IWebhookService
    {
        Task SendComplaintCreatedWebhookAsync(int complaintId);
        Task SendComplaintUpdatedWebhookAsync(int complaintId, string status);
    }

    public class WebhookService : IWebhookService
    {
        private readonly IWebhookQueueService _webhookQueue;
        private readonly WebhookOptions _webhookOptions;
        private readonly ILogger<WebhookService> _logger;

        public WebhookService(
            IWebhookQueueService webhookQueue,
            IOptions<WebhookOptions> webhookOptions,
            ILogger<WebhookService> logger)
        {
            _webhookQueue = webhookQueue;
            _webhookOptions = webhookOptions.Value;
            _logger = logger;
        }

        public async Task SendComplaintCreatedWebhookAsync(int complaintId)
        {
            if (!_webhookOptions.Enabled)
            {
                _logger.LogDebug("Webhooks are disabled, skipping complaint created webhook");
                return;
            }

            try
            {
                var payload = new
                {
                    ComplaintId = complaintId,
                    Event = "complaint.created",
                    Timestamp = DateTime.UtcNow
                };

                var webhookUrl = _webhookOptions.GetComplaintNewUrl();
                await _webhookQueue.QueueWebhookAsync(webhookUrl, payload);

                _logger.LogInformation("Queued complaint created webhook for ComplaintId: {ComplaintId}", complaintId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to queue complaint created webhook for ComplaintId: {ComplaintId}", complaintId);
            }
        }

        public async Task SendComplaintUpdatedWebhookAsync(int complaintId, string status)
        {
            if (!_webhookOptions.Enabled)
            {
                _logger.LogDebug("Webhooks are disabled, skipping complaint updated webhook");
                return;
            }

            try
            {
                var payload = new
                {
                    ComplaintId = complaintId,
                    Status = status,
                    Event = "complaint.updated",
                    Timestamp = DateTime.UtcNow
                };

                var webhookUrl = _webhookOptions.GetComplaintUpdatedUrl();
                await _webhookQueue.QueueWebhookAsync(webhookUrl, payload);

                _logger.LogInformation("Queued complaint updated webhook for ComplaintId: {ComplaintId}, Status: {Status}", 
                    complaintId, status);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to queue complaint updated webhook for ComplaintId: {ComplaintId}", complaintId);
            }
        }
    }
}
