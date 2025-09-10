"use client";
import { useState } from "react";
import TrackingTimeline from '@/components/TrackingTimeline';
import { ComplaintTrackingResponse } from '@/types/complaint';

export default function TrackingPage() {
  const [ticketId, setTicketId] = useState("");
  const [complaint, setComplaint] = useState<ComplaintTrackingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId.trim()) {
      setError("กรุณาระบุหมายเลข Ticket ID");
      return;
    }

    setLoading(true);
    setError("");
    setComplaint(null);

    try {
      console.log("🔍 Searching for ticket:", ticketId);
      // ค้นหาเรื่องร้องเรียนด้วย ticketId - แก้ไข URL ให้ถูกต้อง
      const res = await fetch(`/api/complaints/ticket/${ticketId}/tracking`);
      console.log("📥 API Response status:", res.status);
      console.log("📥 API Response ok:", res.ok);
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("ไม่พบเรื่องร้องเรียนด้วยหมายเลขนี้");
        }
        const errorText = await res.text();
        console.log("❌ Error response:", errorText);
        throw new Error("เกิดข้อผิดพลาดในการค้นหา");
      }
      
      const data = await res.json();
      console.log("✅ Success response:", data);
      setComplaint(data);
    } catch (err: any) {
      console.log("❌ Catch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ติดตามสถานะเรื่องร้องเรียน
          </h1>
          <p className="text-gray-600">
            ระบุหมายเลข Ticket ID เพื่อดูสถานะการดำเนินการ
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="ticketId" className="block text-sm font-medium text-gray-700 mb-2">
                  หมายเลข Ticket ID
                </label>
                <input
                  type="text"
                  id="ticketId"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ระบุหมายเลข Ticket ID เช่น CMP-2025-001"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[120px]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      ค้นหา...
                    </span>
                  ) : (
                    "ค้นหา"
                  )}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {complaint && (
          <div className="space-y-6">
            {/* Complaint Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">ข้อมูลเรื่องร้องเรียน</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <strong className="text-gray-700">Ticket ID:</strong>
                  <div className="text-gray-900">{complaint.ticketId}</div>
                </div>
                <div>
                  <strong className="text-gray-700">หัวข้อ:</strong>
                  <div className="text-gray-900">{complaint.subject}</div>
                </div>
                <div>
                  <strong className="text-gray-700">สถานะปัจจุบัน:</strong>
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm mt-1 ${
                      complaint.currentStatus === 'Submitted'
                        ? 'bg-yellow-100 text-yellow-800'
                        : complaint.currentStatus === 'Forwarded'
                        ? 'bg-blue-100 text-blue-800'
                        : complaint.currentStatus === 'Received'
                        ? 'bg-purple-100 text-purple-800'
                        : complaint.currentStatus === 'InProgress'
                        ? 'bg-orange-100 text-orange-800'
                        : complaint.currentStatus === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : complaint.currentStatus === 'Closed'
                        ? 'bg-gray-100 text-gray-800'
                        : complaint.currentStatus === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {complaint.currentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <TrackingTimeline 
              timeline={complaint.timeline || []}
              ticketId={complaint.ticketId}
              subject={complaint.subject}
              currentStatus={complaint.currentStatus}
            />
          </div>
        )}

        {/* Instructions */}
        {!complaint && !loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-3">
              วิธีการใช้งาน
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ระบุหมายเลข Ticket ID ที่ได้รับหลังจากส่งเรื่องร้องเรียนสำเร็จ
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ระบบจะแสดงสถานะปัจจุบันและประวัติการดำเนินการทั้งหมด
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ข้อมูลจะอัพเดทแบบ Real-time ตามการดำเนินการของเจ้าหน้าที่
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
