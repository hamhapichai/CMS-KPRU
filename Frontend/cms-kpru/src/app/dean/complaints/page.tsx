"use client";
import { useState, useEffect } from "react";
import { getUserRoleFromJWT, getUserFromJWT } from '@/utils/jwt';
import { useRouter } from "next/navigation";

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

export default function DeanComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ id: string; username: string; fullName: string; role: string; departmentId?: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const router = useRouter();

  useEffect(() => {
    // Route protection
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwt");
      const role = getUserRoleFromJWT(token || "");
      const userData = getUserFromJWT(token || "");
      
      if (!(role?.toLowerCase() === "dean")) {
        window.location.href = "/login";
        return;
      }
      
      setUser(userData);
    }
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/complaints");
      if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลได้");
      const data = await res.json();
      setComplaints(data);
      setFilteredComplaints(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search effect
  useEffect(() => {
    let filtered = complaints;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(complaint => complaint.currentStatus === statusFilter);
    }

    // Search by subject
    if (searchQuery.trim()) {
      filtered = filtered.filter(complaint =>
        complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.ticketId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(complaint => 
        new Date(complaint.submissionDate) >= new Date(dateFrom)
      );
    }
    
    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999); // Set to end of day
      filtered = filtered.filter(complaint => 
        new Date(complaint.submissionDate) <= endDate
      );
    }

    setFilteredComplaints(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [statusFilter, searchQuery, dateFrom, dateTo, complaints]);

  // Pagination
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComplaints = filteredComplaints.slice(startIndex, endIndex);

  const handleRowClick = (complaintId: number) => {
    router.push(`/dean/complaints/${complaintId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-100 text-blue-800';
      case 'Forwarded': return 'bg-yellow-100 text-yellow-800';
      case 'Received': return 'bg-orange-100 text-orange-800';
      case 'InProgress': return 'bg-purple-100 text-purple-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Submitted': return 'เรื่องร้องเรียนใหม่';
      case 'Forwarded': return 'ส่งต่อแล้ว';
      case 'Received': return 'รับเรื่องแล้ว';
      case 'InProgress': return 'กำลังดำเนินการ';
      case 'Completed': return 'ดำเนินการเสร็จ';
      case 'Closed': return 'ปิดเรื่อง';
      case 'Rejected': return 'ปฏิเสธ';
      default: return status;
    }
  };

  if (loading) return <div className="p-8">กำลังโหลด...</div>;
  if (error) return <div className="p-8 text-red-500">เกิดข้อผิดพลาด: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-green-700">
                รายการเรื่องร้องเรียน - สายตรงคณบดี
              </h1>
              <p className="text-gray-600 mt-1">
                ยินดีต้อนรับ {user?.fullName} | จัดการเรื่องร้องเรียนทั้งหมด
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">จำนวนเรื่องทั้งหมด</div>
              <div className="text-2xl font-bold text-green-600">{filteredComplaints.length} / {complaints.length}</div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ค้นหาตามหัวข้อหรือ Ticket ID
              </label>
              <input
                type="text"
                placeholder="กรอกหัวข้อหรือ Ticket ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                กรองตามสถานะ
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
              >
                <option value="all">ทุกสถานะ</option>
                <option value="Submitted">เรื่องร้องเรียนใหม่</option>
                <option value="Forwarded">ส่งต่อแล้ว</option>
                <option value="Received">รับเรื่องแล้ว</option>
                <option value="InProgress">กำลังดำเนินการ</option>
                <option value="Completed">ดำเนินการเสร็จ</option>
                <option value="Closed">ปิดเรื่อง</option>
                <option value="Rejected">ปฏิเสธ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                วันที่เริ่มต้น
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                วันที่สิ้นสุด
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
              />
            </div>
          </div>
          {/* Clear filters button */}
          {(searchQuery || statusFilter !== "all" || dateFrom || dateTo) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setDateFrom("");
                  setDateTo("");
                }}
                className="px-4 py-2 text-sm text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-md transition-colors"
              >
                ล้างตัวกรอง
              </button>
            </div>
          )}
        </div>

        {/* Complaints List */}
        <div className="bg-white rounded-lg shadow-md">
          {filteredComplaints.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">
                {searchQuery || statusFilter !== 'all' || dateFrom || dateTo ? 'ไม่พบเรื่องร้องเรียนตามเงื่อนไขที่กำหนด' : 'ยังไม่มีเรื่องร้องเรียน'}
              </h3>
              <p>
                {searchQuery || statusFilter !== 'all' || dateFrom || dateTo ? 'ลองปรับเปลี่ยนคำค้นหาหรือตัวกรอง' : 'ไม่มีเรื่องร้องเรียนในระบบในขณะนี้'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ticket ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        หัวข้อ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ผู้แจ้ง
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        วันที่แจ้ง
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        สถานะ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentComplaints.map((complaint) => (
                      <tr 
                        key={complaint.complaintId} 
                        className="hover:bg-green-50 cursor-pointer transition-colors duration-200"
                        onClick={() => handleRowClick(complaint.complaintId)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {complaint.ticketId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-xs truncate" title={complaint.subject}>
                            {complaint.subject}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {complaint.isAnonymous ? "ไม่ระบุชื่อ" : (complaint.contactName || "ไม่ระบุ")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(complaint.submissionDate).toLocaleDateString('th-TH')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(complaint.currentStatus)}`}>
                            {getStatusText(complaint.currentStatus)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <div className="pagination-container">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="pagination-button green"
                      >
                        ก่อนหน้า
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="pagination-button green"
                      >
                        ถัดไป
                      </button>
                    </div>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        แสดง <span className="font-medium">{startIndex + 1}</span> ถึง <span className="font-medium">{Math.min(endIndex, filteredComplaints.length)}</span> จาก{' '}
                        <span className="font-medium">{filteredComplaints.length}</span> รายการ
                      </p>
                    </div>
                    <div>
                      <nav className="pagination-container" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="pagination-button green"
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`pagination-button green ${page === currentPage ? 'active' : ''}`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="pagination-button green"
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Stats */}
        {complaints.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4 text-center border-l-4 border-blue-500">
              <div className="text-2xl font-bold text-blue-800">
                {complaints.filter(c => c.currentStatus === 'Submitted').length}
              </div>
              <div className="text-sm text-blue-600">รอดำเนินการ</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center border-l-4 border-purple-500">
              <div className="text-2xl font-bold text-purple-800">
                {complaints.filter(c => c.currentStatus === 'InProgress').length}
              </div>
              <div className="text-sm text-purple-600">กำลังดำเนินการ</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center border-l-4 border-green-500">
              <div className="text-2xl font-bold text-green-800">
                {complaints.filter(c => c.currentStatus === 'Completed').length}
              </div>
              <div className="text-sm text-green-600">เสร็จแล้ว</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center border-l-4 border-gray-500">
              <div className="text-2xl font-bold text-gray-800">
                {complaints.filter(c => c.currentStatus === 'Closed').length}
              </div>
              <div className="text-sm text-gray-600">ปิดเรื่องแล้ว</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
