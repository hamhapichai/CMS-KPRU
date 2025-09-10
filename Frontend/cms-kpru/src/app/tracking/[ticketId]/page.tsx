"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import TrackingTimeline from '@/components/TrackingTimeline';
import { ComplaintTrackingResponse } from '@/types/complaint';

export default function TrackingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.ticketId as string;
  
  const [complaint, setComplaint] = useState<ComplaintTrackingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ticketId) {
      loadComplaint();
    }
  }, [ticketId]);

  const loadComplaint = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("🔍 Loading complaint for ticket:", ticketId);
      const res = await fetch(`/api/complaints/ticket/${ticketId}/tracking`);
      console.log("📥 API Response status:", res.status);
      
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

  const goBackToSearch = () => {
    router.push('/tracking');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">กำลังโหลดข้อมูล...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              ติดตามสถานะเรื่องร้องเรียน
            </h1>
            <button
              onClick={goBackToSearch}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 font-medium"
            >
              ← กลับไปค้นหา
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            หมายเลข Ticket: <span className="font-mono font-medium text-blue-600">{ticketId}</span>
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-red-800 font-medium">ไม่สามารถโหลดข้อมูลได้</h3>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={loadComplaint}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors duration-200"
            >
              ลองใหม่
            </button>
          </div>
        )}

        {/* Success State */}
        {complaint && (
          <div>
            {/* Complaint Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {complaint.subject}
                    </h2>
                    <p className="text-gray-600 mb-3">
                      หมายเลข Ticket: <span className="font-mono font-medium text-blue-600">{complaint.ticketId}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      complaint.currentStatus === 'รอการดำเนินการ' ? 'bg-yellow-100 text-yellow-800' :
                      complaint.currentStatus === 'กำลังดำเนินการ' ? 'bg-blue-100 text-blue-800' :
                      complaint.currentStatus === 'เสร็จสิ้น' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {complaint.currentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-green-800 font-medium">เรื่องร้องเรียนถูกส่งสำเร็จแล้ว</h3>
                  <p className="text-green-600 mt-1">
                    ระบบได้รับเรื่องร้องเรียนของคุณเรียบร้อยแล้ว กรุณาบันทึกหมายเลข Ticket ID นี้ไว้สำหรับติดตามสถานะ
                  </p>
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
      </div>
    </div>
  );
}
