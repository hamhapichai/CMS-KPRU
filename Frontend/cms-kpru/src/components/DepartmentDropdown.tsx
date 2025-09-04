import React, { useEffect, useState } from 'react';

// Global cache เพื่อหลีกเลี่ยงการเรียก API ซ้ำ
let departmentsCache: { id: number; name: string }[] | null = null;
let isLoading = false;
const subscribers: ((data: { id: number; name: string }[]) => void)[] = [];

const fetchDepartments = async (): Promise<{ id: number; name: string }[]> => {
  // ถ้ามี cache แล้ว ส่งกลับทันที
  if (departmentsCache) {
    return departmentsCache;
  }

  // ถ้ากำลัง loading อยู่ ให้รอจนกว่าจะเสร็จ
  if (isLoading) {
    return new Promise((resolve) => {
      subscribers.push(resolve);
    });
  }

  isLoading = true;
  console.log("Fetching departments from API..."); // Debug

  try {
    const res = await fetch('/api/departments');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Filter และ cache ข้อมูล
    const validDepartments = (Array.isArray(data) ? data : [])
      .filter(d => d && typeof d.id === 'number' && d.name);
    
    departmentsCache = validDepartments;
    console.log("Departments cached:", validDepartments); // Debug

    // แจ้งให้ subscribers ทั้งหมด
    subscribers.forEach(callback => callback(validDepartments));
    subscribers.length = 0; // Clear subscribers

    return validDepartments;
  } catch (err) {
    console.error("Error loading departments:", err);
    return [];
  } finally {
    isLoading = false;
  }
};

// Export function สำหรับ clear cache เมื่อมีการอัพเดตข้อมูล
export const clearDepartmentsCache = () => {
  departmentsCache = null;
  console.log("Departments cache cleared");
};

export default function DepartmentDropdown({ 
  value, 
  onChange, 
  className = "",
  returnId = false, // เพิ่ม option เพื่อเลือกว่าจะ return ID หรือ name
  keyPrefix = "dept" // เพิ่ม prefix สำหรับ key เพื่อหลีกเลี่ยง collision
}: { 
  value?: string; 
  onChange: (val: string) => void;
  className?: string;
  returnId?: boolean;
  keyPrefix?: string;
}) {
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [instanceId] = useState(() => Math.random().toString(36).substr(2, 9)); // Generate once on mount
  
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const data = await fetchDepartments();
        if (isMounted) {
          setDepartments(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error in DepartmentDropdown:", err);
          setDepartments([]);
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array to run only once

  return (
    <select 
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${className}`}
      value={value || ''} 
      onChange={e => onChange(e.target.value)}
      disabled={loading}
    >
      <option value="">
        {loading ? "กำลังโหลด..." : "เลือกหน่วยงาน..."}
      </option>
      {departments.map((d, index) => (
        <option 
          key={`${keyPrefix}-${instanceId}-${d.id || index}-${returnId ? 'id' : 'name'}`} 
          value={returnId ? (d.id?.toString() || '') : (d.name || '')}
        >
          {d.name || 'ไม่ระบุชื่อ'}
        </option>
      ))}
    </select>
  );
}
