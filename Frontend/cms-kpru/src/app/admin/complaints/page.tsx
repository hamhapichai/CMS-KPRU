"use client";
import { useState, useEffect } from "react";
import { getUserRoleFromJWT } from '@/utils/jwt';
import Link from "next/link";

interface Attachment {
  attachmentId: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

interface Complaint {
  complaintId: number;
  contactName?: string;
  contactEmail: string;
  contactPhone?: string;
  subject: string;
  message: string;
  submissionDate: string;
  currentStatus: string;
  isAnonymous: boolean;
  ticketId: string;
  attachments: Attachment[];
}

export default function ComplaintsPage() {
  // ...existing code...
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Route protection
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwt");
      const role = getUserRoleFromJWT(token || "");
      if (!(role?.toLowerCase() === "admin" || role?.toLowerCase() === "dean" || role?.toLowerCase() === "officer")) {
        window.location.href = "/login";
        return;
      }
    }
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/complaints");
      if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลได้");
      const data = await res.json();
      setComplaints(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">กำลังโหลด...</div>;
  if (error) return <div className="p-8 text-red-500">เกิดข้อผิดพลาด: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">จัดการเรื่องร้องเรียน</h1>
        {complaints.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">ไม่มีเรื่องร้องเรียน</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left">หัวข้อ</th>
                  <th className="py-3 px-4 text-left">วันที่แจ้ง</th>
                  <th className="py-3 px-4 text-left">สถานะ</th>
                  <th className="py-3 px-4 text-left">ดูรายละเอียด</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.complaintId} className="border-b">
                    <td className="py-3 px-4 font-semibold">{complaint.subject}</td>
                    <td className="py-3 px-4">{new Date(complaint.submissionDate).toLocaleString('th-TH')}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        complaint.currentStatus === 'Submitted'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {complaint.currentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link href={`/admin/complaints/${complaint.complaintId}`} className="text-blue-600 hover:underline font-bold">ดูรายละเอียด</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
