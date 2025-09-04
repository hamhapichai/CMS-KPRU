namespace Backend.Configuration
{
    public class WebhookOptions
    {
        public const string SectionName = "Webhooks";
        
        public string N8nBaseUrl { get; set; } = string.Empty;
        public string ComplaintNewEndpoint { get; set; } = string.Empty;
        public string ComplaintUpdatedEndpoint { get; set; } = string.Empty;
        public bool Enabled { get; set; } = true;
        public int TimeoutSeconds { get; set; } = 30;
        public int MaxRetries { get; set; } = 3;
        
        public string GetComplaintNewUrl() => $"{N8nBaseUrl.TrimEnd('/')}{ComplaintNewEndpoint}";
        public string GetComplaintUpdatedUrl() => $"{N8nBaseUrl.TrimEnd('/')}{ComplaintUpdatedEndpoint}";
    }
}
