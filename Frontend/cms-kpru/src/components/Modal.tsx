"use client";
import React from 'react';

export default function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  const [show, setShow] = React.useState(open);
  const [visible, setVisible] = React.useState(open);
  React.useEffect(() => {
    if (open) {
      setShow(true);
      setTimeout(() => setVisible(true), 10); // trigger transition
      // เพิ่ม listener สำหรับปุ่ม Escape
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    } else {
      setVisible(false);
      const timeout = setTimeout(() => setShow(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [open, onClose]);
  if (!show) return null;
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded shadow-lg p-6 min-w-[350px] relative transform transition-all duration-300 ${visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <button className="absolute top-2 right-2 text-3xl font-bold cursor-pointer transition z-50 pointer-events-auto" style={{color: 'black', background: 'none', border: 'none', boxShadow: 'none', padding: 0, textShadow: '0 1px 4px rgba(0,0,0,0.15)'}} onClick={onClose} aria-label="ปิด">×</button>
        {children}
      </div>
    </div>
  );
}
