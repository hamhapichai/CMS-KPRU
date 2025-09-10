"use client";
import { ComplaintLog, ActionDisplayNames, StatusDisplayNames } from '@/types/complaint';

interface TrackingTimelineProps {
  timeline: ComplaintLog[];
  ticketId: string;
  subject: string;
  currentStatus: string;
}

export default function TrackingTimeline({ timeline, ticketId, subject, currentStatus }: TrackingTimelineProps) {
  const formatDateTime = (dateString: string) => {
    try {
      // ตรวจสอบว่า dateString เป็น valid date หรือไม่
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        
        return 'วันที่ไม่ถูกต้อง';
      }
      
      return date.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Bangkok'
      });
    } catch {
      
      return 'วันที่ไม่ถูกต้อง';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-100 text-blue-800';
      case 'Forwarded': return 'bg-yellow-100 text-yellow-800';
      case 'Received': return 'bg-purple-100 text-purple-800';
      case 'InProgress': return 'bg-orange-100 text-orange-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Submit':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
          </svg>
        );
      case 'Forward':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        );
      case 'Receive':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
          </svg>
        );
      case 'StartProgress':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 015 0H17M7 13h10" />
          </svg>
        );
      case 'Complete':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Close':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'Reject':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800">ประวัติการดำเนินการ</h2>
      
      {/* Header Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{subject}</h3>
            <p className="text-sm text-gray-600">Ticket ID: {ticketId}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus)}`}>
            {StatusDisplayNames[currentStatus as keyof typeof StatusDisplayNames] || currentStatus}
          </span>
        </div>
      </div>
      
      {timeline.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>ยังไม่มีประวัติการดำเนินการ</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-6 bottom-6 w-0.5 bg-gray-200"></div>
          
          {timeline.map((log, index) => (
            <div key={log.logId || index} className="relative flex items-start mb-6 last:mb-0">
              {/* Timeline dot */}
              <div className="flex-shrink-0 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white relative z-10">
                {getActionIcon(log.action)}
              </div>
              
              {/* Content */}
              <div className="ml-6 flex-1">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">
                        {ActionDisplayNames[log.action] || log.action}
                      </h3>
                      {log.newStatus && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.newStatus)}`}>
                          {StatusDisplayNames[log.newStatus as keyof typeof StatusDisplayNames] || log.newStatus}
                        </span>
                      )}
                    </div>
                    <time className="text-sm text-gray-500">
                      {formatDateTime(log.timestamp)}
                    </time>
                  </div>
                  
                  {log.departmentName && (
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">หน่วยงาน:</span> {log.departmentName}
                    </div>
                  )}
                  
                  {log.departmentName && (
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">ผู้ดำเนินการ:</span> {log.departmentName}
                    </div>
                  )}
                  
                  {log.notes && (
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">หมายเหตุ:</span> {log.notes}
                    </div>
                  )}
                  
                  {log.previousStatus && log.previousStatus !== log.newStatus && (
                    <div className="text-xs text-gray-500 mt-2 flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded ${getStatusColor(log.previousStatus)}`}>
                        {StatusDisplayNames[log.previousStatus as keyof typeof StatusDisplayNames] || log.previousStatus}
                      </span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className={`px-2 py-1 rounded ${getStatusColor(log.newStatus)}`}>
                        {StatusDisplayNames[log.newStatus as keyof typeof StatusDisplayNames] || log.newStatus}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
