"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserRoleFromJWT } from '@/utils/jwt';
import Link from "next/link";
import Modal from '@/components/Modal';
import DepartmentDropdown from '@/components/DepartmentDropdown';
import ComplaintTracking from '@/components/ComplaintTracking';
import { Complaint, StatusDisplayNames } from '@/types/complaint';

interface AISuggestion {
    aiSuggestionId: number;
    complaintId: number;
    suggestedDeptId?: number;
    departmentName?: string;
    suggestedCategory?: string;
    summarizedByAI?: string;
    confidenceScore?: number;
    suggestedAt: string;
    n8nWorkflowId?: string;
}

export default function DeanComplaintDetailPage() {
    const { complaintId } = useParams();
    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForwardModal, setShowForwardModal] = useState(false);
    const [forwardData, setForwardData] = useState({
        departmentId: "",
        notes: ""
    });
    const [isForwarding, setIsForwarding] = useState(false);

    useEffect(() => {
        // Route protection
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("jwt");
            const role = getUserRoleFromJWT(token || "");
            if (!(role?.toLowerCase() === "dean")) {
                window.location.href = "/login";
                return;
            }
        }
        fetchComplaint();
        fetchAISuggestion();
        // eslint-disable-next-line
    }, [complaintId]);

    const fetchComplaint = async () => {
        try {
            const res = await fetch(`/api/complaints/${complaintId}`);
            if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลได้");
            const data = await res.json();
            setComplaint(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
        } finally {
            setLoading(false);
        }
    };

    const fetchAISuggestion = async () => {
        try {
            const res = await fetch(`/api/AISuggestions/complaint/${complaintId}`);
            if (res.ok) {
                const data = await res.json();
                setAiSuggestion(data);
            }
            // ไม่ throw error ถ้าไม่มี AI suggestion เพราะอาจจะยังไม่มี
        } catch {
            // Silent fail - AI suggestion is optional
            
        }
    };

    const handleForward = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!forwardData.departmentId) {
            alert("กรุณาเลือกหน่วยงาน");
            return;
        }

        setIsForwarding(true);
        try {
            const res = await fetch(`/api/complaints/${complaintId}/forward`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    departmentId: parseInt(forwardData.departmentId),
                    notes: forwardData.notes,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "ไม่สามารถส่งต่อเรื่องได้");
            }

            await res.json();
            alert(`ส่งต่อเรื่องเรียบร้อยแล้ว`);
            setShowForwardModal(false);
            setForwardData({ departmentId: "", notes: "" });

            // รีเฟรชข้อมูลเรื่องร้องเรียน
            await fetchComplaint();
            await fetchAISuggestion();
        } catch (err) {
            alert(`เกิดข้อผิดพลาด: ${err instanceof Error ? err.message : 'ไม่ทราบสาเหตุ'}`);
        } finally {
            setIsForwarding(false);
        }
    };

    if (loading) return <div className="p-8">กำลังโหลด...</div>;
    if (error) return <div className="p-8 text-red-500">เกิดข้อผิดพลาด: {error}</div>;
    if (!complaint) return <div className="p-8">ไม่พบข้อมูลเรื่องร้องเรียน</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                {/* Breadcrumb / Action Bar */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Link href="/dean/complaints" className="hover:text-green-600 font-medium">
                                รายการเรื่องร้องเรียน
                            </Link>
                            <span className="text-gray-400">/</span>
                            <span className="text-green-700 font-semibold truncate max-w-md">
                                {complaint.subject}
                            </span>
                        </div>
                        <Link
                            href="/dean/complaints"
                            className="flex items-center space-x-1 text-green-600 hover:text-green-700 font-medium text-sm bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>กลับ</span>
                        </Link>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                    <h1 className="text-2xl font-bold mb-4 text-green-700">รายละเอียดเรื่องร้องเรียน - คณบดี</h1>
                    <div className="mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
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
                            {StatusDisplayNames[complaint.currentStatus as keyof typeof StatusDisplayNames] || complaint.currentStatus}
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
                                            className="text-green-600 hover:text-green-800 underline"
                                        >
                                            {attachment.fileName}
                                        </a>
                                        <span className="text-sm text-gray-500 ml-2">({attachment.fileType})</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* AI Suggestion Section */}
                    {aiSuggestion ? (
                        <div className="mb-4 border-t pt-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-blue-700">ข้อเสนอแนะจาก AI:</h3>
                                <button 
                                    onClick={fetchAISuggestion}
                                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                                >
                                    รีเฟรช
                                </button>
                            </div>
                            
                            {aiSuggestion.summarizedByAI && (
                                <div className="mb-4 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                                    <strong className="text-blue-800">สรุปเรื่อง:</strong>
                                    <div className="mt-2 text-gray-700 whitespace-pre-wrap">
                                        {aiSuggestion.summarizedByAI}
                                    </div>
                                </div>
                            )}
                            
                            {aiSuggestion.departmentName && (
                                <div className="mb-4 bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                                    <strong className="text-green-800">หน่วยงานที่แนะนำ:</strong>
                                    <div className="mt-2 text-gray-700 flex items-center justify-between">
                                        <span>{aiSuggestion.departmentName}</span>
                                        {aiSuggestion.confidenceScore && (
                                            <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                ความมั่นใจ: {Math.round((aiSuggestion.confidenceScore || 0) * 100)}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            {aiSuggestion.suggestedCategory && (
                                <div className="mb-4 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                                    <strong className="text-yellow-800">หมวดหมู่:</strong>
                                    <div className="mt-2 text-gray-700">{aiSuggestion.suggestedCategory}</div>
                                </div>
                            )}
                            
                            <div className="text-xs text-gray-500 mt-3">
                                วิเคราะห์โดย AI เมื่อ: {new Date(aiSuggestion.suggestedAt).toLocaleString('th-TH')}
                            </div>
                        </div>
                    ) : (
                        <div className="mb-4 border-t pt-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-gray-500">ข้อเสนอแนะจาก AI:</h3>
                                <button 
                                    onClick={fetchAISuggestion}
                                    className="text-xs text-gray-600 hover:text-gray-800 underline"
                                >
                                    รีเฟรช
                                </button>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300">
                                <div className="text-gray-500 italic">
                                    {loading ? "กำลังรอการวิเคราะห์จาก AI..." : "ยังไม่มีข้อเสนอแนะจาก AI"}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action buttons for dean */}
                    <div className="mb-4 border-t pt-4">
                        <h3 className="font-bold mb-2">การดำเนินการ:</h3>
                        <div className="space-x-2">
                            {complaint.currentStatus === 'Completed' && (
                                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold">
                                    อนุมัติปิดเรื่อง
                                </button>
                            )}
                            {complaint.currentStatus === 'Submitted' && (
                                <button
                                    onClick={() => setShowForwardModal(true)}
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-bold"
                                >
                                    ส่งต่อหน่วยงานที่เกี่ยวข้อง
                                </button>
                            )}
                            {complaint.currentStatus === 'Submitted' && (
                                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold">
                                    ปฏิเสธ
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Forward Modal */}
                    <Modal open={showForwardModal} onClose={() => {
                        setShowForwardModal(false);
                        setForwardData({ departmentId: "", notes: "" });
                    }}>
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-green-700 mb-4 pr-8">ส่งต่อเรื่องร้องเรียน</h3>

                            <form onSubmit={handleForward} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        เลือกหน่วยงาน <span className="text-red-500">*</span>
                                    </label>
                                    <DepartmentDropdown
                                        value={forwardData.departmentId}
                                        onChange={(val) => setForwardData({ ...forwardData, departmentId: val })}
                                        returnId={true}
                                        keyPrefix="forward"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        หมายเหตุ/โน๊ต
                                    </label>
                                    <textarea
                                        value={forwardData.notes}
                                        onChange={(e) => setForwardData({ ...forwardData, notes: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                                        rows={3}
                                        placeholder="ระบุหมายเหตุหรือข้อมูลเพิ่มเติม..."
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForwardModal(false);
                                            setForwardData({ departmentId: "", notes: "" });
                                        }}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                                        disabled={isForwarding}
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        disabled={isForwarding}
                                    >
                                        {isForwarding ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                กำลังส่งต่อ...
                                            </span>
                                        ) : (
                                            "ส่งต่อเรื่อง"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                </div>

                {/* Tracking Timeline */}
                <ComplaintTracking complaintId={complaint.complaintId} />

                {/* Back button */}
                <div className="mt-6">
                    <Link href="/dean/complaints" className="text-green-600 hover:underline font-bold">← กลับไปหน้ารายการ</Link>
                </div>
            </div>
        </div>
    );
}
