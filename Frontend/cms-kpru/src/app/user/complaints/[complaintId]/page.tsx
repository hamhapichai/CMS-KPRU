"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserRoleFromJWT, getUserFromJWT } from '@/utils/jwt';
import Link from "next/link";
import Modal from '@/components/Modal';
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

export default function UserComplaintDetailPage() {
    const { complaintId } = useParams();
    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState<{ 
        id?: string; 
        username?: string; 
        fullName?: string; 
        role?: string; 
        departmentId?: string;
        userId?: string;
        sub?: string;
        nameid?: string;
    } | null>(null);
    const [showReceiveModal, setShowReceiveModal] = useState(false);
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [actionData, setActionData] = useState({ notes: "" });
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Route protection
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("jwt");
            
            
            const role = getUserRoleFromJWT(token || "");
            const userData = getUserFromJWT(token || "");
            
            
            
            
            if (!role || role.toLowerCase() !== "user") {
                
                window.location.href = "/login";
                return;
            }
            
            if (!userData || !userData.userId) {
                
                // ลอง parse JWT ใหม่
                if (token) {
                    try {
                        JSON.parse(atob(token.split('.')[1]));
                        
                    } catch {
                        
                    }
                }
            }
            
            setUser(userData);
        }
        
        fetchComplaint();
        fetchAISuggestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        } catch {
            
        }
    };

    const handleReceiveComplaint = async (e: React.FormEvent) => {
        e.preventDefault();
        
        
        
        
        // ตรวจสอบ userId จากหลายแหล่ง
        let userId = user?.userId || user?.sub || user?.id || user?.nameid;
        
        
        if (!userId) {
            
            
            // ลองดึงจาก JWT โดยตรง
            const token = localStorage.getItem("jwt");
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    
                    userId = payload.userId || payload.sub || payload.id || payload.nameid || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                    
                } catch {
                    
                }
            }
            
            if (!userId) {
                alert("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
                window.location.href = "/login";
                return;
            }
        }

        setIsProcessing(true);
        try {
            
            const requestData = {
                userId: parseInt(userId),
                notes: actionData.notes
            };
            
            
            const res = await fetch(`/api/complaints/${complaintId}/receive`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            
            

            if (!res.ok) {
                const errorData = await res.json();
                
                throw new Error(errorData.message || "ไม่สามารถรับเรื่องได้");
            }

            await res.json();
            

            alert("รับเรื่องเรียบร้อยแล้ว");
            setShowReceiveModal(false);
            setActionData({ notes: "" });
            await fetchComplaint();
        } catch (err) {
            
            alert(`เกิดข้อผิดพลาด: ${err instanceof Error ? err.message : 'ไม่ทราบสาเหตุ'}`);
        } finally {
            
            setIsProcessing(false);
        }
    };

    const handleStartProgress = async (e: React.FormEvent) => {
        e.preventDefault();
        
        
        
        
        // ตรวจสอบ userId จากหลายแหล่ง
        let userId = user?.userId || user?.sub || user?.id || user?.nameid;
        
        
        if (!userId) {
            
            
            // ลองดึงจาก JWT โดยตรง
            const token = localStorage.getItem("jwt");
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    
                    userId = payload.userId || payload.sub || payload.id || payload.nameid || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                    
                } catch {
                    
                }
            }
            
            if (!userId) {
                alert("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
                window.location.href = "/login";
                return;
            }
        }

        setIsProcessing(true);
        try {
            
            const requestData = {
                userId: parseInt(userId),
                notes: actionData.notes
            };
            
            
            const res = await fetch(`/api/complaints/${complaintId}/start-progress`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            
            

            if (!res.ok) {
                const errorData = await res.json();
                
                throw new Error(errorData.message || "ไม่สามารถเริ่มดำเนินการได้");
            }

            await res.json(); // Success response
            

            alert("เริ่มดำเนินการเรียบร้อยแล้ว");
            setShowProgressModal(false);
            setActionData({ notes: "" });
            await fetchComplaint();
        } catch (err: unknown) {
            
            alert(`เกิดข้อผิดพลาด: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            
            setIsProcessing(false);
        }
    };

    const handleCompleteComplaint = async (e: React.FormEvent) => {
        e.preventDefault();
        
        
        
        
        
        if (!actionData.notes.trim()) {
            alert("กรุณาระบุรายละเอียดการดำเนินการ");
            return;
        }
        
        // ตรวจสอบ userId จากหลายแหล่ง
        let userId = user?.userId || user?.sub || user?.id || user?.nameid;
        
        
        if (!userId) {
            
            
            // ลองดึงจาก JWT โดยตรง
            const token = localStorage.getItem("jwt");
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    
                    userId = payload.userId || payload.sub || payload.id || payload.nameid || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                    
                } catch {
                    
                }
            }
            
            if (!userId) {
                alert("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
                window.location.href = "/login";
                return;
            }
        }

        setIsProcessing(true);
        try {
            
            const requestData = {
                userId: parseInt(userId),
                processingNotes: actionData.notes
            };
            
            
            const res = await fetch(`/api/complaints/${complaintId}/complete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            
            

            if (!res.ok) {
                const errorData = await res.json();
                
                throw new Error(errorData.message || "ไม่สามารถดำเนินการเสร็จได้");
            }

            await res.json(); // Success response
            

            alert("ดำเนินการเสร็จเรียบร้อยแล้ว");
            setShowCompleteModal(false);
            setActionData({ notes: "" });
            await fetchComplaint();
        } catch (err: unknown) {
            
            alert(`เกิดข้อผิดพลาด: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            
            setIsProcessing(false);
        }
    };

    if (loading) return <div className="p-8">กำลังโหลด...</div>;
    if (error) return <div className="p-8 text-red-500">เกิดข้อผิดพลาด: {error}</div>;
    if (!complaint) return <div className="p-8">ไม่พบข้อมูลเรื่องร้องเรียน</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                {/* Breadcrumb */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Link href="/user/complaints" className="hover:text-blue-600 font-medium">
                                รายการเรื่องร้องเรียน
                            </Link>
                            <span className="text-gray-400">/</span>
                            <span className="text-blue-700 font-semibold truncate max-w-md">
                                {complaint.subject}
                            </span>
                        </div>
                        <Link
                            href="/user/complaints"
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
                <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                    <h1 className="text-2xl font-bold mb-4 text-blue-700">รายละเอียดเรื่องร้องเรียน - เจ้าหน้าที่</h1>
                    
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

                    {/* AI Suggestions */}
                    {aiSuggestion && (
                        <div className="mb-4 border-t pt-4">
                            <h3 className="font-bold mb-2 text-purple-700">ข้อเสนอแนะจาก AI:</h3>
                            
                            {aiSuggestion.summarizedByAI && (
                                <div className="mb-3 bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400">
                                    <strong className="text-purple-800">สรุปเรื่อง:</strong>
                                    <div className="mt-2 text-gray-700">{aiSuggestion.summarizedByAI}</div>
                                </div>
                            )}
                            
                            {aiSuggestion.suggestedCategory && (
                                <div className="mb-3 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                                    <strong className="text-blue-800">หมวดหมู่:</strong>
                                    <div className="mt-2 text-gray-700">{aiSuggestion.suggestedCategory}</div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mb-4 border-t pt-4">
                        <h3 className="font-bold mb-2">การดำเนินการ:</h3>
                        <div className="space-x-2">
                            {complaint.currentStatus === 'Forwarded' && (
                                <button
                                    onClick={() => {
                                        
                                        
                                        setShowReceiveModal(true);
                                    }}
                                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded font-bold"
                                >
                                    รับเรื่อง
                                </button>
                            )}
                            {complaint.currentStatus === 'Received' && (
                                <button
                                    onClick={() => {
                                        
                                        
                                        setShowProgressModal(true);
                                    }}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-bold"
                                >
                                    เริ่มดำเนินการ
                                </button>
                            )}
                            {complaint.currentStatus === 'InProgress' && (
                                <button
                                    onClick={() => {
                                        
                                        
                                        setShowCompleteModal(true);
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold"
                                >
                                    ดำเนินการเสร็จ
                                </button>
                            )}
                            <Link
                                href={`/api/complaints/${complaint.complaintId}/tracking`}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-bold inline-block"
                                target="_blank"
                            >
                                ติดตามสถานะ
                            </Link>
                        </div>
                    </div>

                    {/* Receive Modal */}
                    <Modal open={showReceiveModal} onClose={() => setShowReceiveModal(false)}>
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-orange-700 mb-4 pr-8">รับเรื่องร้องเรียน</h3>
                            <form onSubmit={handleReceiveComplaint} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        หมายเหตุ
                                    </label>
                                    <textarea
                                        value={actionData.notes}
                                        onChange={(e) => setActionData({ notes: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        rows={3}
                                        placeholder="ระบุหมายเหตุ (ถ้ามี)..."
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowReceiveModal(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                        disabled={isProcessing}
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? "กำลังดำเนินการ..." : "รับเรื่อง"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>

                    {/* Progress Modal */}
                    <Modal open={showProgressModal} onClose={() => setShowProgressModal(false)}>
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-purple-700 mb-4 pr-8">เริ่มดำเนินการ</h3>
                            <form onSubmit={handleStartProgress} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        หมายเหตุ
                                    </label>
                                    <textarea
                                        value={actionData.notes}
                                        onChange={(e) => setActionData({ notes: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        rows={3}
                                        placeholder="ระบุแผนการดำเนินการ..."
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowProgressModal(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                        disabled={isProcessing}
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? "กำลังดำเนินการ..." : "เริ่มดำเนินการ"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>

                    {/* Complete Modal */}
                    <Modal open={showCompleteModal} onClose={() => setShowCompleteModal(false)}>
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-green-700 mb-4 pr-8">ดำเนินการเสร็จ</h3>
                            <form onSubmit={handleCompleteComplaint} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        รายละเอียดการดำเนินการ <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={actionData.notes}
                                        onChange={(e) => setActionData({ notes: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        rows={4}
                                        placeholder="ระบุรายละเอียดการดำเนินการและผลลัพธ์..."
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCompleteModal(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                        disabled={isProcessing}
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? "กำลังดำเนินการ..." : "ดำเนินการเสร็จ"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                </div>

                {/* Tracking Timeline */}
                <ComplaintTracking complaintId={complaint.complaintId} />
            </div>
        </div>
    );
}
