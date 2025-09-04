"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

export default function ComplaintDetailPage() {
  const { complaintId } = useParams();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
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
    fetchComplaint();
    // eslint-disable-next-line
  }, [complaintId]);

  const fetchComplaint = async () => {
    try {
      const res = await fetch(`/api/complaints/${complaintId}`);
      if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลได้");
      const data = await res.json();
      setComplaint(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">กำลังโหลด...</div>;
  if (error) return <div className="p-8 text-red-500">เกิดข้อผิดพลาด: {error}</div>;
  if (!complaint) return <div className="p-8">ไม่พบข้อมูลเรื่องร้องเรียน</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb / Action Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/admin/complaints" className="hover:text-blue-600 font-medium">
                จัดการเรื่องร้องเรียน
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-blue-700 font-semibold truncate max-w-md">
                {complaint.subject}
              </span>
            </div>
            <Link 
              href="/admin/complaints" 
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>กลับ</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4">รายละเอียดเรื่องร้องเรียน</h1>
        <div className="mb-4">
          <span className={`px-3 py-1 rounded-full text-sm ${
            complaint.currentStatus === 'Submitted'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {complaint.currentStatus}
          </span>
        </div>
        <div className="mb-4">
          <strong>หัวข้อ:</strong> {complaint.subject}
        </div>
        <div className="mb-4">
          <strong>วันที่แจ้ง:</strong> {new Date(complaint.submissionDate).toLocaleString('th-TH')}
        </div>
        <div className="mb-4">
          <strong>Ticket ID:</strong> {complaint.ticketId}
        </div>
        <div className="mb-4">
          <strong>ผู้แจ้ง:</strong> {complaint.isAnonymous ? "ไม่ระบุชื่อ" : complaint.contactName || "ไม่ระบุ"}
        </div>
        <div className="mb-4">
          <strong>อีเมล:</strong> {complaint.isAnonymous ? "ไม่ระบุ" : complaint.contactEmail}
        </div>
        <div className="mb-4">
          <strong>เบอร์โทร:</strong> {complaint.isAnonymous ? "ไม่ระบุ" : (complaint.contactPhone || "ไม่ระบุ")}
        </div>
        <div className="mb-4">
          <strong>รายละเอียด:</strong>
          <div className="mt-2 text-gray-700 whitespace-pre-wrap">{complaint.message}</div>
        </div>
        {complaint.attachments && complaint.attachments.length > 0 && (
          <div className="mb-4">
            <strong>ไฟล์แนบ:</strong>
            <ul className="mt-2 space-y-2">
              {complaint.attachments.map((attachment) => (
                <li key={attachment.attachmentId}>
                  <a
                    href={attachment.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {attachment.fileName}
                  </a>
                  <span className="text-sm text-gray-500 ml-2">({attachment.fileType})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-8">
          <Link href="/admin/complaints" className="text-blue-600 hover:underline font-bold">← กลับไปหน้ารายการ</Link>
        </div>
        </div>
      </div>
    </div>
  );
}
