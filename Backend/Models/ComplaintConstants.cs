namespace Backend.Models
{
    public static class ComplaintStatus
    {
        public const string Submitted = "Submitted";
        public const string Forwarded = "Forwarded";
        public const string Received = "Received";
        public const string InProgress = "InProgress";
        public const string Completed = "Completed";
        public const string Closed = "Closed";
        public const string Rejected = "Rejected";
        public const string Reopened = "Reopened";
    }

    public static class ComplaintAction
    {
        public const string Submit = "Submit";
        public const string Forward = "Forward";
        public const string Receive = "Receive";
        public const string StartProgress = "StartProgress";
        public const string Complete = "Complete";
        public const string Close = "Close";
        public const string Reject = "Reject";
        public const string Reopen = "Reopen";
        public const string AddNote = "AddNote";
    }
}
