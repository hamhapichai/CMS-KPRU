"use client";
import React, { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import Table, { TableColumn } from '@/components/Table';

interface Department {
  id: number;
  name: string;
  description?: string;
}

export default function DepartmentsPage() {
  useEffect(() => {
    fetchDepartments();
  }, []);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDept, setNewDept] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState<'edit' | 'create' | false>(false);
  const [editDept, setEditDept] = useState<Department | null>(null);

  const fetchDepartments = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:5000/api/departments');
    if (res.ok) {
      setDepartments(await res.json());
    } else {
      setDepartments([]);
    }
    setLoading(false);
  };

  const handleEdit = async () => {
    if (!editDept) return;
    await fetch(`http://localhost:5000/api/departments/${editDept.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ DepartmentName: editDept.name, Description: editDept.description })
    });
    setEditModalOpen(false);
    setEditDept(null);
    fetchDepartments();
  };

  const handleCreate = async () => {
    if (!newDept.name) return;
    await fetch('http://localhost:5000/api/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ DepartmentName: newDept.name, Description: newDept.description })
    });
    setNewDept({ name: '', description: '' });
    setEditModalOpen(false);
    fetchDepartments();
  };
  return (
    <div>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-gray-800">จัดการหน่วยงาน</h2>
          <button className="px-6 py-3 rounded-xl font-bold shadow bg-blue-600 hover:bg-blue-700 text-white transition" onClick={() => setEditModalOpen('create')}>
            + เพิ่มหน่วยงาน
          </button>
        </div>
        <div>
          <Table
            columns={[
              { key: 'name', header: 'ชื่อหน่วยงาน', className: 'font-medium text-gray-800' },
              { key: 'description', header: 'รายละเอียด' },
              {
                key: 'edit', header: 'แก้ไข', render: (_, row) => (
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl font-bold shadow transition"
                    style={{fontSize:'0.95rem', boxShadow:'0 1px 4px rgba(0,0,0,0.10)'}}
                    onClick={() => { setEditDept(row); setEditModalOpen('edit'); }}
                  >
                    แก้ไข
                  </button>
                )
              },
            ]}
            data={departments}
            loading={loading}
            emptyText="ไม่มีข้อมูล"
          />
        </div>
      </div>
      {/* Modal สำหรับเพิ่ม Department */}
      <Modal open={editModalOpen === 'create'} onClose={() => setEditModalOpen(false)}>
        <h3 className="font-extrabold text-lg mb-4 text-gray-800">เพิ่มหน่วยงาน</h3>
        <div className="grid grid-cols-1 gap-3 mb-4">
          <input
            className="border border-gray-300 p-3 rounded-xl shadow-sm"
            placeholder="ชื่อหน่วยงาน"
            value={newDept.name}
            onChange={e => setNewDept({ ...newDept, name: e.target.value })}
          />
          <input
            className="border border-gray-300 p-3 rounded-xl shadow-sm"
            placeholder="รายละเอียด"
            value={newDept.description || ''}
            onChange={e => setNewDept({ ...newDept, description: e.target.value })}
          />
        </div>
        <div className="flex gap-3 justify-end">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-xl font-bold" onClick={() => setEditModalOpen(false)}>ยกเลิก</button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold" onClick={handleCreate}>บันทึก</button>
        </div>
      </Modal>
      {/* Modal สำหรับแก้ไข Department */}
      <Modal open={editModalOpen === 'edit' && !!editDept} onClose={() => { setEditModalOpen(false); setEditDept(null); }}>
        <h3 className="font-extrabold text-lg mb-4 text-gray-800">แก้ไขข้อมูลหน่วยงาน</h3>
        <div className="grid grid-cols-1 gap-3 mb-4">
          <input
            className="border border-gray-300 p-3 rounded-xl shadow-sm"
            placeholder="ชื่อหน่วยงาน"
            value={editDept?.name || ''}
            onChange={e => { if (editDept) setEditDept({ ...editDept, name: e.target.value }); }}
          />
              <input
                className="border border-gray-300 p-3 rounded-xl shadow-sm"
                placeholder="รายละเอียด"
                value={editDept?.description || ''}
                onChange={e => { if (editDept) setEditDept({ ...editDept, description: e.target.value }); }}
              />
        </div>
        <div className="flex gap-3 justify-end">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-xl font-bold" onClick={() => { setEditModalOpen(false); setEditDept(null); }}>ยกเลิก</button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold" onClick={handleEdit}>บันทึก</button>
        </div>
      </Modal>
    </div>
  );
}
