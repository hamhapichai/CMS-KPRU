"use client";
import React, { useState, useEffect } from 'react';
import { User, Role } from '@/types/user';
import Button from './Button';
import Table from './Table';
import DepartmentDropdown from './DepartmentDropdown';
import Modal from './Modal';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User> & { password?: string }>({});
  const [editUser, setEditUser] = useState<Partial<User>>({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [roles, setRoles] = useState<{ roleId: number; roleName: string }[]>([]);
  // Fetch roles from API
  const fetchRoles = async () => {
    const res = await fetch('http://localhost:5000/api/roles');
    if (res.ok) {
      const data = await res.json();
      setRoles(data);
    } else {
      setRoles([]);
    }
  };


  const fetchUsers = async () => {
    setLoading(true);
    const params = new URLSearchParams({ search, page: page.toString(), pageSize: pageSize.toString() });
    const res = await fetch(`http://localhost:5000/api/users?${params}`);
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
      setTotal(data.total);
    } else {
      setUsers([]);
      setTotal(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [search, page, pageSize]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreateUser = async () => {
    if (!newUser.username || !newUser.fullName || !newUser.email || !newUser.role || !newUser.password) return;
    const res = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        password: newUser.password,
        department: newUser.department
      })
    });
    if (res.ok) {
      setNewUser({});
      fetchUsers();
    }
  };

  const handleUpdateUser = async () => {
    const res = await fetch(`http://localhost:5000/api/users/${editUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: editUser.username,
        fullName: editUser.fullName,
        email: editUser.email,
        role: editUser.role,
        department: editUser.department
      })
    });
    if (res.ok) {
      setEditModalOpen(false);
      setEditUser({});
      fetchUsers();
    }
  };

  const handleToggleActive = (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    fetch(`http://localhost:5000/api/users/${id}/active`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(!user.isActive)
    }).then(() => fetchUsers());
  };

  const handleResetPassword = (id: number) => {
    const newPassword = prompt("Enter new password:");
    if (!newPassword) return;
    fetch(`http://localhost:5000/api/users/${id}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPassword)
    }).then(() => alert("Password reset successful"));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-gray-800">ผู้ใช้งาน</h2>
        <Button style={{padding: '0.75rem 1.5rem', borderRadius: '0.75rem', background: '#2563eb', color: '#fff', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}} onClick={() => setModalOpen(true)}>
          + สร้างผู้ใช้งาน
        </Button>
      </div>
      <div className="flex mb-6 gap-4">
        <input
          className="border border-gray-300 p-3 rounded-xl shadow-sm w-72 focus:ring-2 focus:ring-blue-200"
          placeholder="ค้นหา"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <select className="border border-gray-300 p-3 rounded-xl shadow-sm" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
          {[10, 20, 50].map(size => <option key={size} value={size}>{size} / หน้า</option>)}
        </select>
      </div>
      <Table
        columns={[
          { key: 'username', header: 'ชื่อผู้ใช้', className: 'font-medium text-gray-800' },
          { key: 'fullName', header: 'ชื่อ-นามสกุล' },
          { key: 'email', header: 'อีเมล' },
          { key: 'role', header: 'สิทธิ์' },
          { key: 'department', header: 'หน่วยงาน' },
          { key: 'lastLoginAt', header: 'เข้าสู่ระบบล่าสุด', render: (val) => val ? new Date(val).toLocaleString() : '-' },
          {
            key: 'isActive', header: 'สถานะ', render: (val, row) => (
              <Button
                style={{padding: '0.5rem 1rem', borderRadius: '0.75rem', fontWeight: 'bold', background: val ? '#22c55e' : '#e11d48', color: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.10)', fontSize: '0.95rem'}}
                onClick={() => handleToggleActive(row.id)}
              >
                {val ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
              </Button>
            )
          },
          {
            key: 'reset', header: 'รีเซ็ตรหัสผ่าน', render: (_, row) => (
              <Button
                style={{padding: '0.5rem 1rem', borderRadius: '0.75rem', fontWeight: 'bold', background: '#2563eb', color: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.10)', fontSize: '0.95rem'}}
                onClick={() => handleResetPassword(row.id)}
              >
                รีเซ็ตรหัสผ่าน
              </Button>
            )
          },
          {
            key: 'edit', header: 'แก้ไข', render: (_, row) => (
              <Button
                style={{padding: '0.5rem 1rem', borderRadius: '0.75rem', fontWeight: 'bold', background: '#f59e42', color: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.10)', fontSize: '0.95rem'}}
                onClick={() => { setEditUser(row); setEditModalOpen(true); }}
              >
                แก้ไข
              </Button>
            )
          },
        ]}
        data={users}
        loading={loading}
        emptyText="ไม่มีข้อมูล"
      />
      <div className="flex justify-end items-center gap-3 mt-2">
        <span className="text-gray-600">หน้า {page} / {Math.ceil(total / pageSize) || 1}</span>
        <Button disabled={page === 1} style={{padding: '0.5rem 1rem', borderRadius: '0.75rem', background: '#e5e7eb', color: '#333', fontWeight: 'bold'}} onClick={() => setPage(page - 1)}>ก่อนหน้า</Button>
        <Button disabled={page * pageSize >= total} style={{padding: '0.5rem 1rem', borderRadius: '0.75rem', background: '#e5e7eb', color: '#333', fontWeight: 'bold'}} onClick={() => setPage(page + 1)}>ถัดไป</Button>
      </div>
      {/* Edit User Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <h3 className="font-extrabold text-lg mb-4 text-gray-800">แก้ไขข้อมูลผู้ใช้งาน</h3>
        <div className="grid grid-cols-1 gap-3 mb-4">
          <input
            className="border border-gray-300 p-3 rounded-xl shadow-sm"
            placeholder="ชื่อผู้ใช้"
            value={editUser.username || ''}
            onChange={e => setEditUser({ ...editUser, username: e.target.value })}
          />
          <input
            className="border border-gray-300 p-3 rounded-xl shadow-sm"
            placeholder="ชื่อ-นามสกุล"
            value={editUser.fullName || ''}
            onChange={e => setEditUser({ ...editUser, fullName: e.target.value })}
          />
          <input
            className="border border-gray-300 p-3 rounded-xl shadow-sm"
            placeholder="อีเมล"
            value={editUser.email || ''}
            onChange={e => setEditUser({ ...editUser, email: e.target.value })}
          />
          <select
            className="border border-gray-300 p-3 rounded-xl shadow-sm"
            value={editUser.role || ''}
            onChange={e => setEditUser({ ...editUser, role: e.target.value as Role })}
          >
            <option value="">สิทธิ์</option>
            {roles
              .filter(role => role.roleId !== undefined && role.roleName !== undefined)
              .map((role) => (
                <option key={`${role.roleId}-${role.roleName}`} value={role.roleName}>
                  {role.roleName}
                </option>
              ))}
          </select>
          <DepartmentDropdown
            value={editUser.department || ''}
            onChange={(val: string) => setEditUser({ ...editUser, department: val })}
          />
        </div>
        <Button
          style={{padding: '0.75rem 1.5rem', borderRadius: '0.75rem', background: '#2563eb', color: '#fff', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}
          onClick={async () => { await handleUpdateUser(); }}
        >
          บันทึก
        </Button>
      </Modal>
      {/* Create User Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h3 className="font-extrabold text-lg mb-4 text-gray-800">สร้างผู้ใช้งาน</h3>
        <div className="grid grid-cols-1 gap-3 mb-4">
          <input
            className="border border-gray-300 p-3 rounded-xl shadow-sm"
            placeholder="ชื่อผู้ใช้"
            value={newUser.username || ''}
            onChange={e => setNewUser({ ...newUser, username: e.target.value })}
          />
          <input
            className="border border-gray-300 p-3 rounded-xl shadow-sm"
            placeholder="ชื่อ-นามสกุล"
            value={newUser.fullName || ''}
            onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
          />
          <input
            className="border border-gray-300 p-3 rounded-xl shadow-sm"
            placeholder="อีเมล"
            value={newUser.email || ''}
            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            className="border border-gray-300 p-3 rounded-xl shadow-sm"
            placeholder="รหัสผ่าน"
            type="password"
            value={newUser.password || ''}
            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
          />
          <select
            className="border border-gray-300 p-3 rounded-xl shadow-sm"
            value={newUser.role || ''}
            onChange={e => setNewUser({ ...newUser, role: e.target.value as Role })}
          >
            <option value="">สิทธิ์</option>
            {roles
              .filter(role => role.roleId !== undefined && role.roleName !== undefined)
              .map((role) => (
                <option key={`${role.roleId}-${role.roleName}`} value={role.roleName}>
                  {role.roleName}
                </option>
              ))}
          </select>
          <DepartmentDropdown
            value={newUser.department || ''}
            onChange={(val: string) => setNewUser({ ...newUser, department: val })}
          />
        </div>
        <Button
          style={{padding: '0.75rem 1.5rem', borderRadius: '0.75rem', background: '#2563eb', color: '#fff', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}
          onClick={async () => { await handleCreateUser(); setModalOpen(false); }}
        >
          บันทึก
        </Button>
      </Modal>
    </div>
  );
}
