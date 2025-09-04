"use client";
import React, { useState } from 'react';

const menuItems = [
  { label: 'จัดการผู้ใช้', href: '/admin' },
  { label: 'หน่วยงาน', href: '/admin/departments' },
  // เพิ่มเมนูอื่น ๆ ได้
];

export default function AdminMenu() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="relative">
      <button
        className="p-2 rounded bg-gray-200"
        onClick={() => setOpen(!open)}
        aria-label="Open menu"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-48 bg-white border rounded shadow z-10">
          {menuItems.map(item => (
            <a key={item.href} href={item.href} className="block px-4 py-2 hover:bg-gray-100">{item.label}</a>
          ))}
        </div>
      )}
    </nav>
  );
}
